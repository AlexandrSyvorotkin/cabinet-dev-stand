import type { AddMediaFormValues } from './add-media-form';
import { getBasicServiceLabelsMap } from './basic-services';
import { getServicePackageLabel, normalizeServicePackage, type ServicePackage } from './pricing';
import { parsePrice } from '@/shared/lib/pricing';

export type MediaServicePriceItem = {
  label: string;
  price: number;
  group: 'placement' | 'social';
};

export type MediaPackageSummaryItem = {
  label: string;
  kind: 'discount' | 'bonus';
  description: string;
};

export type MediaPricingSummary = {
  services: MediaServicePriceItem[];
  packages: MediaPackageSummaryItem[];
  agencyDiscountPercent: number | null;
  addons: { name: string; price: number }[];
};

const formatServiceList = (ids: string[], labelsMap: Record<string, string>): string => {
  if (ids.length === 0) {
    return '—';
  }

  return ids.map((id) => labelsMap[id] ?? id).join(', ');
};

const getDiscountPackageDescription = (
  servicePackage: ServicePackage,
  labelsMap: Record<string, string>,
): string => {
  const normalizedPackage = normalizeServicePackage(servicePackage);
  const parts: string[] = [];

  if (normalizedPackage.baseServiceKeys.length > 0) {
    parts.push(`база: ${formatServiceList(normalizedPackage.baseServiceKeys, labelsMap)}`);
  }

  const discountedParts = normalizedPackage.discountedServices
    .filter((item) => item.serviceKeys.length > 0)
    .map(
      (item) =>
        `${formatServiceList(item.serviceKeys, labelsMap)} (−${item.percent}%)`,
    );

  if (discountedParts.length > 0) {
    parts.push(`со скидкой: ${discountedParts.join('; ')}`);
  }

  if (parts.length === 0) {
    return '—';
  }

  return parts.join(' · ');
};

const getBonusPackageDescription = (
  servicePackage: ServicePackage,
  labelsMap: Record<string, string>,
): string => {
  const condition = formatServiceList(servicePackage.serviceKeys, labelsMap);
  const bonus = formatServiceList(servicePackage.bonusServiceKeys, labelsMap);

  if (condition === '—' && bonus === '—') {
    return '—';
  }

  if (bonus === '—') {
    return `условие: ${condition}`;
  }

  if (condition === '—') {
    return `бонус: ${bonus}`;
  }

  return `${condition} → ${bonus}`;
};

export const getMediaPricingSummary = (data: AddMediaFormValues): MediaPricingSummary => {
  const labelsMap = getBasicServiceLabelsMap(data.basicServices.items);

  const services = data.basicServices.items
    .map((item) => ({
      label: item.label,
      group: item.group,
      price: parsePrice(data.basicServices.values[item.id]?.price),
    }))
    .filter((item) => item.price > 0);

  const packages = data.pricingRules.servicePackages.map((servicePackage, index) => ({
    label: getServicePackageLabel(servicePackage, index),
    kind: servicePackage.kind,
    description:
      servicePackage.kind === 'discount'
        ? getDiscountPackageDescription(servicePackage, labelsMap)
        : getBonusPackageDescription(servicePackage, labelsMap),
  }));

  const addons = data.pricingRules.addons
    .filter((addon) => addon.enabled && addon.name.trim())
    .map((addon) => ({
      name: addon.name.trim(),
      price: parsePrice(addon.price),
    }))
    .filter((addon) => addon.price > 0);

  return {
    services,
    packages,
    agencyDiscountPercent: data.pricingRules.agencyDiscount.enabled
      ? data.pricingRules.agencyDiscount.percent
      : null,
    addons,
  };
};

export const formatPrice = (value: number): string => `${value.toLocaleString('ru-RU')} ₽`;
