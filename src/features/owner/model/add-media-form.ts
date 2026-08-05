import type {
  CreateMediaPartnerInput,
  CreateMediaPromotionInput,
} from '@/shared/api/graphql';
import { applyAgencyDiscountToPrice, parsePrice } from '@/shared/lib/pricing';
import type { BasicServicesState } from './basic-services';
import {
  createEmptyBasicServices,
  getPlacementItems,
  getSocialItems,
  getSocialPlatformId,
  type BasicServiceItemConfig,
} from './basic-services';
import { createEmptyServicePackage, type PricingRules, type ServicePackage } from './pricing';
import {
  createEmptySocialNetworks,
  syncSocialNetworksWithBasicServices,
  type SocialNetworksValues,
} from './social-networks';

export type {
  BasicServiceItem,
  BasicServiceItemConfig,
  BasicServiceKey,
  BasicServiceRowValues,
  BasicServicesState,
} from './basic-services';
export {
  addCustomPlacementService,
  addCustomSocialService,
  BASIC_SERVICE_OPTIONS,
  BUILTIN_BASIC_SERVICES_CONFIG,
  canAddSocialPlatform,
  canRemoveBasicService,
  createCustomPlacementService,
  createCustomSocialService,
  createEmptyBasicServices,
  getBasicServiceLabelsMap,
  getBasicServiceSelectOptions,
  getEligibleBasicServiceKeys,
  getPlacementItems,
  getPlacementTypeId,
  getSocialItems,
  isHeadlineLimitDisabled,
  isMaxCharsDisabled,
  removeBasicService,
  updateBasicServiceItem,
  updateBasicServiceLabel,
  updatePlacementType,
  updateSocialPlatform,
} from './basic-services';
export type { SocialNetworkItem, SocialNetworkRowValues, SocialNetworksValues } from './social-networks';
export {
  createEmptySocialNetworks,
  getSocialNetworkById,
  hasNonCompliantRknPlatforms,
  isSocialPlatformActive,
  parseSubscriberCount,
  requiresRknCompliance,
  RKN_SUBSCRIBER_THRESHOLD,
  syncSocialNetworksWithBasicServices,
  updateSocialNetworkItem,
} from './social-networks';
export type {
  DiscountedServiceItem,
  PricingAddon,
  PricingRules,
  ServicePackage,
  ServicePackageKind,
} from './pricing';
export {
  createDiscountedServiceItem,
  createEmptyServicePackage,
  createPricingAddon,
  createServicePackage,
  getDiscountedServiceKeys,
  getServicePackageLabel,
  normalizeServicePackage,
  sanitizePricingSelections,
} from './pricing';

export { MEDIA_REGIONS } from './media-regions';
export { MEDIA_CIS_COUNTRIES } from './media-cis-countries';
export {
  areAllMediaThemesSelected,
  getMediaThemeSelectValue,
  MEDIA_THEME_OPTIONS,
  MEDIA_THEME_SELECT_ALL,
  MEDIA_THEMES,
  normalizeMediaThemeSelection,
} from './media-themes';

export type AddMediaFormValues = {
  name: string;
  url: string;
  description: string;
  region: string;
  city: string;
  coverage: string;
  themes: string[];
  trafficReach: string;
  servicePackage: PricingRules;
  basicServices: BasicServicesState;
  socialNetworks: SocialNetworksValues;
};

export type MediaBasicServicePayload = BasicServiceItemConfig & {
  availableForDiscount: boolean;
  availableForBonus: boolean;
};

export type CreateMediaPayload = Omit<AddMediaFormValues, 'basicServices'> & {
  basicServices: MediaBasicServicePayload[];
};

/** id секций из listAllMediaSections на бэкенде */
const MEDIA_SECTION_ID = {
  TELEGRAM: 1,
  WEB: 2,
} as const;

const SOCIAL_PLATFORM_SECTION_ID: Partial<Record<string, number>> = {
  telegram: MEDIA_SECTION_ID.TELEGRAM,
};

/** Поля формы без отдельного поля в API — уходят в description */
const buildDescription = (values: AddMediaFormValues): string => {
  const lines: string[] = [];

  if (values.trafficReach.trim()) lines.push(`Охват: ${values.trafficReach.trim()}`);
  if (values.coverage.trim()) lines.push(`Тип СМИ: ${values.coverage.trim()}`);
  if (values.region.trim()) lines.push(`Регион/страна: ${values.region.trim()}`);
  if (values.city.trim()) lines.push(`Город: ${values.city.trim()}`);
  if (values.themes.length > 0) lines.push(`Темы: ${values.themes.join(', ')}`);

  for (const item of getSocialItems(values.basicServices)) {
    const socialRow = values.socialNetworks.find((entry) => entry.id === item.id);
    if (!socialRow) continue;

    const platformLabel = item.label.trim() || getSocialPlatformId(item) || item.id;
    const socialLines: string[] = [];

    if (socialRow.reachOrSubscribers.trim()) {
      socialLines.push(`подписчики: ${socialRow.reachOrSubscribers.trim()}`);
    }

    if (socialRow.rknRegistered && socialRow.rknNumber.trim()) {
      socialLines.push(`РКН: ${socialRow.rknNumber.trim()}`);
    } else if (socialRow.rknApplicationSubmitted) {
      socialLines.push('РКН: заявление подано');
    } else if (socialRow.rknNotSubmitted) {
      socialLines.push('РКН: не подано');
    }

    if (socialLines.length > 0) {
      lines.push(`${platformLabel}: ${socialLines.join(', ')}`);
    }
  }

  return lines.join('\n');
};

/** Скрин 2 — базовые услуги → CreateMediaOffersInput */
const mapOffer = (
  item: BasicServiceItemConfig,
  agencyDiscount: PricingRules['agencyDiscount'],
) => {
  const price = parsePrice(item.price);
  const priceWithDiscount = applyAgencyDiscountToPrice(price, agencyDiscount);

  return {
    name: item.label.trim() || 'Услуга',
    partner_section_id: item.placementTypeId ?? item.platformId ?? item.id,
    price: price > 0 ? price : null,
    price_with_discount:
      agencyDiscount.enabled && priceWithDiscount !== price ? priceWithDiscount : null,
  };
};

/** Скрин 1 — ссылки (сайт + соцсети) → media_sections с вложенными offers */
const mapMediaSections = (values: AddMediaFormValues) => {
  const { basicServices, servicePackage } = values;
  const sections: NonNullable<CreateMediaPartnerInput['media_sections']> = [];

  if (values.url.trim()) {
    sections.push({
      media_section_id: MEDIA_SECTION_ID.WEB,
      title: values.name.trim() || 'Сайт',
      url: values.url.trim(),
      offers: getPlacementItems(basicServices).map((item) =>
        mapOffer(item, servicePackage.agencyDiscount),
      ),
    });
  }

  for (const item of getSocialItems(basicServices)) {
    const platformId = getSocialPlatformId(item);
    const sectionId = platformId ? SOCIAL_PLATFORM_SECTION_ID[platformId] : undefined;
    const url = values.socialNetworks.find((entry) => entry.id === item.id)?.link.trim() ?? '';

    if (!sectionId || !url) continue;

    sections.push({
      media_section_id: sectionId,
      title: item.label.trim() || platformId || 'Соцсеть',
      url,
      offers: [mapOffer(item, servicePackage.agencyDiscount)],
    });
  }

  return sections;
};

/** Скрин 3 — пакеты услуг → media_promotions */
const mapMediaPromotions = (
  servicePackages: ServicePackage[],
): CreateMediaPromotionInput[] | undefined => {
  const promotions = servicePackages
    .map((servicePackage): CreateMediaPromotionInput | null => {
      if (servicePackage.baseServiceKeys.length === 0) return null;

      const type = servicePackage.kind === 'bonus' ? 'BONUS' : 'DISCOUNT';
      const conditions = servicePackage.baseServiceKeys.map((offerId) => ({ offer_id: offerId }));
      const targets =
        servicePackage.kind === 'bonus'
          ? servicePackage.bonusServiceKeys.map((offerId) => ({ offer_id: offerId, value: 100 }))
          : servicePackage.discountedServices.flatMap((discountedItem) =>
              discountedItem.serviceKeys.map((offerId) => ({
                offer_id: offerId,
                value: discountedItem.percent,
              })),
            );

      if (targets.length === 0) return null;

      return { type, logic: 'ALL', conditions, targets };
    })
    .filter((promotion): promotion is CreateMediaPromotionInput => promotion != null);

  return promotions.length > 0 ? promotions : undefined;
};

export const toCreateMediaPartnerInput = (
  values: AddMediaFormValues,
): CreateMediaPartnerInput => {
  const userDescription = values.description.trim();
  const metadataDescription = buildDescription(values);

  return {
    name: values.name.trim(),
    description: userDescription || metadataDescription,
    media_sections: mapMediaSections(values),
    media_promotions: mapMediaPromotions(values.servicePackage.servicePackages),
  };
};

export const serializeCreateMediaPayload = (values: AddMediaFormValues): CreateMediaPayload => {
  const { basicServices, ...rest } = values;

  return {
    ...rest,
    basicServices: basicServices.items.map((item) => ({
      ...item,
      availableForDiscount: item.discount,
      availableForBonus: item.bonus,
    })),
  };
};

export const MEDIA_COVERAGE_LEVELS = [
  'Региональное',
  'Федеральное',
  'Международное',
] as const;

export const REGIONAL_MEDIA_COVERAGE = MEDIA_COVERAGE_LEVELS[0];
export const FEDERAL_MEDIA_COVERAGE = MEDIA_COVERAGE_LEVELS[1];
export const INTERNATIONAL_MEDIA_COVERAGE = MEDIA_COVERAGE_LEVELS[2];

export const isRegionalMedia = (coverage: string) => coverage === REGIONAL_MEDIA_COVERAGE;
export const isInternationalMedia = (coverage: string) =>
  coverage === INTERNATIONAL_MEDIA_COVERAGE;

export const EMPTY_ADD_MEDIA_FORM: AddMediaFormValues = (() => {
  const basicServices = createEmptyBasicServices();
  const socialIds = basicServices.items
    .filter((item) => item.group === 'social')
    .map((item) => item.id);

  return {
    name: '',
    url: '',
    description: '',
    region: '',
    city: '',
    coverage: FEDERAL_MEDIA_COVERAGE,
    themes: [],
    trafficReach: '',
    servicePackage: createEmptyServicePackage(),
    basicServices,
    socialNetworks: syncSocialNetworksWithBasicServices(socialIds, createEmptySocialNetworks()),
  };
})();
