import type {
  AgencyDiscount,
  PriceBreakdownLine,
  PriceCalculationResult,
  PricingAddon,
  PricingRules,
  ServicePackage,
} from '@/features/owner/model/pricing';
import {
  getDiscountedServiceKeys,
  normalizeServicePackage,
} from '@/features/owner/model/pricing';

type CalculatePriceInput = {
  servicePrices: Partial<Record<string, number>>;
  serviceLabels: Record<string, string>;
  selectedServiceKeys: string[];
  rules: PricingRules;
  activePackageIds?: string[];
};

const parsePrice = (value: string | number | undefined): number => {
  if (value == null || value === '') {
    return 0;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getServiceLabel = (key: string, serviceLabels: Record<string, string>): string => {
  return serviceLabels[key] ?? key;
};

const applyAgencyDiscountToPrice = (
  price: number,
  agencyDiscount: AgencyDiscount,
): number => {
  if (!agencyDiscount.enabled || agencyDiscount.percent <= 0) {
    return price;
  }

  return Math.round(price * (1 - agencyDiscount.percent / 100));
};

const getEffectiveServicePrices = (
  servicePrices: Partial<Record<string, number>>,
  agencyDiscount: AgencyDiscount,
): Partial<Record<string, number>> => {
  if (!agencyDiscount.enabled || agencyDiscount.percent <= 0) {
    return servicePrices;
  }

  return Object.fromEntries(
    Object.entries(servicePrices).map(([key, price]) => [
      key,
      applyAgencyDiscountToPrice(price ?? 0, agencyDiscount),
    ]),
  );
};

const getServicePackageDiscount = (
  servicePackage: ServicePackage,
  selectedServiceKeys: string[],
  servicePrices: Partial<Record<string, number>>,
  packageLabel: string,
): { amount: number; label: string } | null => {
  if (servicePackage.kind !== 'discount') {
    return null;
  }

  const baseKeys = servicePackage.baseServiceKeys.filter((key) =>
    selectedServiceKeys.includes(key),
  );

  if (baseKeys.length === 0) {
    return null;
  }

  const discountSaved = servicePackage.discountedServices.reduce((total, item) => {
    const itemSaved = item.serviceKeys
      .filter((key) => selectedServiceKeys.includes(key))
      .reduce((sum, key) => {
        const price = servicePrices[key] ?? 0;
        return sum + Math.round((price * item.percent) / 100);
      }, 0);

    return total + itemSaved;
  }, 0);

  if (discountSaved <= 0) {
    return null;
  }

  const percents = [
    ...new Set(
      servicePackage.discountedServices
        .filter((item) => item.serviceKeys.some((key) => selectedServiceKeys.includes(key)))
        .map((item) => item.percent),
    ),
  ];
  const percentLabel =
    percents.length === 1 ? `−${percents[0]}%` : percents.map((value) => `−${value}%`).join(', ');

  return {
    amount: discountSaved,
    label: `${packageLabel}: скидка ${percentLabel} на доп. услуги`,
  };
};

const getBestServicePackageDiscount = (
  rules: PricingRules,
  selectedServiceKeys: string[],
  servicePrices: Partial<Record<string, number>>,
  activePackageIds?: string[],
): PriceBreakdownLine | null => {
  const servicePackages = activePackageIds
    ? rules.servicePackages
        .filter((servicePackage) => activePackageIds.includes(servicePackage.id))
        .map(normalizeServicePackage)
    : rules.servicePackages.map(normalizeServicePackage);

  const discounts = servicePackages
    .map((servicePackage, index) => {
      const packageLabel =
        servicePackage.name.trim() || `Пакет услуг ${index + 1}`;
      return getServicePackageDiscount(
        servicePackage,
        selectedServiceKeys,
        servicePrices,
        packageLabel,
      );
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((left, right) => right.amount - left.amount);

  if (discounts.length === 0) {
    return null;
  }

  const best = discounts[0];

  return {
    label: best.label,
    amount: -best.amount,
  };
};

const getBonusLines = (
  servicePackage: ServicePackage,
  selectedServiceKeys: string[],
  servicePrices: Partial<Record<string, number>>,
  serviceLabels: Record<string, string>,
  packageLabel: string,
): PriceBreakdownLine[] => {
  if (servicePackage.kind !== 'bonus') {
    return [];
  }

  if (
    servicePackage.serviceKeys.length === 0 ||
    !servicePackage.serviceKeys.every((key) => selectedServiceKeys.includes(key))
  ) {
    return [];
  }

  return servicePackage.bonusServiceKeys.map((key) => {
    const label = getServiceLabel(key, serviceLabels);
    const price = servicePrices[key] ?? 0;

    if (selectedServiceKeys.includes(key) && price > 0) {
      return {
        label: `${packageLabel}: бонус «${label}»`,
        amount: -price,
      };
    }

    return {
      label: `${packageLabel}: бонус в подарок «${label}»`,
      amount: 0,
    };
  });
};

const getAddonsTotal = (addons: PricingAddon[]): PriceBreakdownLine[] => {
  return addons
    .filter((addon) => addon.enabled && addon.name.trim())
    .map((addon) => ({
      label: `Доп. услуга: ${addon.name}`,
      amount: parsePrice(addon.price),
    }))
    .filter((line) => line.amount > 0);
};

const calculatePrice = ({
  servicePrices,
  serviceLabels,
  selectedServiceKeys,
  rules,
  activePackageIds,
}: CalculatePriceInput): PriceCalculationResult => {
  const breakdown: PriceBreakdownLine[] = [];
  const effectiveServicePrices = getEffectiveServicePrices(
    servicePrices,
    rules.agencyDiscount,
  );
  const servicePackages = activePackageIds
    ? rules.servicePackages
        .filter((servicePackage) => activePackageIds.includes(servicePackage.id))
        .map(normalizeServicePackage)
    : rules.servicePackages.map(normalizeServicePackage);

  const baseTotal = selectedServiceKeys.reduce(
    (sum, key) => sum + (effectiveServicePrices[key] ?? 0),
    0,
  );

  breakdown.push({
    label: rules.agencyDiscount.enabled
      ? `Базовая сумма услуг (скидка агентству −${rules.agencyDiscount.percent}%)`
      : 'Базовая сумма услуг',
    amount: baseTotal,
  });

  let currentTotal = baseTotal;

  const discountLine = getBestServicePackageDiscount(
    rules,
    selectedServiceKeys,
    effectiveServicePrices,
    activePackageIds,
  );

  if (discountLine) {
    breakdown.push(discountLine);
    currentTotal += discountLine.amount;
  }

  for (const [index, servicePackage] of servicePackages.entries()) {
    const packageLabel = servicePackage.name.trim() || `Пакет услуг ${index + 1}`;

    for (const line of getBonusLines(
      servicePackage,
      selectedServiceKeys,
      effectiveServicePrices,
      serviceLabels,
      packageLabel,
    )) {
      breakdown.push(line);
      currentTotal += line.amount;
    }
  }

  const addonLines = getAddonsTotal(rules.addons);

  for (const line of addonLines) {
    breakdown.push(line);
    currentTotal += line.amount;
  }

  return {
    baseTotal,
    breakdown,
    finalPrice: Math.max(currentTotal, 0),
  };
};

const getServicePackagePreviewKeys = (servicePackage: ServicePackage): string[] => {
  if (servicePackage.kind === 'discount') {
    return [
      ...new Set([
        ...servicePackage.baseServiceKeys,
        ...getDiscountedServiceKeys(servicePackage),
      ]),
    ];
  }

  const keys = new Set(servicePackage.serviceKeys);

  if (servicePackage.kind === 'bonus') {
    for (const key of servicePackage.bonusServiceKeys) {
      keys.add(key);
    }
  }

  return [...keys];
};

const formatServiceList = (keys: string[], serviceLabels: Record<string, string>): string =>
  keys.map((key) => serviceLabels[key] ?? key).join(', ');

const calculateDiscountServicePackagePreview = ({
  servicePackage,
  servicePrices,
  serviceLabels,
  agencyDiscount,
}: {
  servicePackage: ServicePackage;
  servicePrices: Partial<Record<string, number>>;
  serviceLabels: Record<string, string>;
  agencyDiscount: AgencyDiscount;
}): PriceCalculationResult | null => {
  const { baseServiceKeys } = servicePackage;
  const discountedKeys = getDiscountedServiceKeys(servicePackage);

  if (baseServiceKeys.length === 0 && discountedKeys.length === 0) {
    return null;
  }

  const effectivePrices = getEffectiveServicePrices(servicePrices, agencyDiscount);
  const packageApplies = baseServiceKeys.length > 0 && discountedKeys.length > 0;

  const baseAmount = baseServiceKeys.reduce(
    (sum, key) => sum + (effectivePrices[key] ?? 0),
    0,
  );

  const breakdown: PriceBreakdownLine[] = [];

  if (baseAmount > 0) {
    const baseServicesLabel = formatServiceList(baseServiceKeys, serviceLabels);

    breakdown.push({
      label: agencyDiscount.enabled
        ? `Базовые услуги: ${baseServicesLabel} (скидка агентству −${agencyDiscount.percent}%)`
        : `Базовые услуги: ${baseServicesLabel}`,
      amount: baseAmount,
    });
  }

  let discountedAmount = 0;

  for (const item of servicePackage.discountedServices) {
    if (item.serviceKeys.length === 0) {
      continue;
    }

    const itemAmount = item.serviceKeys.reduce((sum, key) => {
      const price = effectivePrices[key] ?? 0;

      if (packageApplies) {
        return sum + Math.round(price * (1 - item.percent / 100));
      }

      return sum + price;
    }, 0);

    discountedAmount += itemAmount;

    const servicesLabel = formatServiceList(item.serviceKeys, serviceLabels);

    breakdown.push({
      label: packageApplies
        ? `Услуги со скидкой: ${servicesLabel} (−${item.percent}%)`
        : `Услуги со скидкой: ${servicesLabel}`,
      amount: itemAmount,
    });
  }

  const finalPrice = baseAmount + discountedAmount;

  return {
    baseTotal: finalPrice,
    breakdown,
    finalPrice,
  };
};

const calculateServicePackagePreview = ({
  servicePackage,
  servicePrices,
  serviceLabels,
  agencyDiscount,
}: {
  servicePackage: ServicePackage;
  servicePrices: Partial<Record<string, number>>;
  serviceLabels: Record<string, string>;
  agencyDiscount: AgencyDiscount;
}): PriceCalculationResult | null => {
  if (servicePackage.kind === 'discount') {
    return calculateDiscountServicePackagePreview({
      servicePackage: normalizeServicePackage(servicePackage),
      servicePrices,
      serviceLabels,
      agencyDiscount,
    });
  }

  const selectedServiceKeys = getServicePackagePreviewKeys(servicePackage);

  if (selectedServiceKeys.length === 0) {
    return null;
  }

  return calculatePrice({
    servicePrices,
    serviceLabels,
    selectedServiceKeys,
    rules: {
      agencyDiscount,
      addons: [],
      servicePackages: [servicePackage],
    },
    activePackageIds: [servicePackage.id],
  });
};

export {
  applyAgencyDiscountToPrice,
  calculatePrice,
  calculateServicePackagePreview,
  parsePrice,
};
