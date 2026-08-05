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

const getSocialMediaSectionId = (platformId: string | null): number =>
  platformId === 'telegram' ? MEDIA_SECTION_ID.TELEGRAM : MEDIA_SECTION_ID.WEB;

/** Скрин 2 — базовые услуги → CreateMediaOffersInput */
const mapOffer = (
  item: BasicServiceItemConfig,
  agencyDiscount: PricingRules['agencyDiscount'],
) => {
  const price = parsePrice(item.price);
  const priceWithDiscount = applyAgencyDiscountToPrice(price, agencyDiscount);

  return {
    name: item.label.trim() || 'Услуга',
    partner_section_id: item.id,
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
    const url = values.socialNetworks.find((entry) => entry.id === item.id)?.link.trim() ?? '';

    if (!url) continue;

    const platformId = getSocialPlatformId(item);

    sections.push({
      media_section_id: getSocialMediaSectionId(platformId),
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
      const type = servicePackage.kind === 'bonus' ? 'BONUS' : 'DISCOUNT';

      if (servicePackage.kind === 'bonus') {
        if (servicePackage.serviceKeys.length === 0 || servicePackage.bonusServiceKeys.length === 0) {
          return null;
        }

        return {
          type,
          logic: 'ALL',
          conditions: servicePackage.serviceKeys.map((offerId) => ({ offer_id: offerId })),
          targets: servicePackage.bonusServiceKeys.map((offerId) => ({
            offer_id: offerId,
            value: 100,
          })),
        };
      }

      if (servicePackage.baseServiceKeys.length === 0) return null;

      const targets = servicePackage.discountedServices.flatMap((discountedItem) =>
        discountedItem.serviceKeys.map((offerId) => ({
          offer_id: offerId,
          value: discountedItem.percent,
        })),
      );

      if (targets.length === 0) return null;

      return {
        type,
        logic: 'ALL',
        conditions: servicePackage.baseServiceKeys.map((offerId) => ({ offer_id: offerId })),
        targets,
      };
    })
    .filter((promotion): promotion is CreateMediaPromotionInput => promotion != null);

  return promotions.length > 0 ? promotions : undefined;
};

export const toCreateMediaPartnerInput = (
  values: AddMediaFormValues,
): CreateMediaPartnerInput => ({
  name: values.name.trim(),
  description: values.description.trim(),
  media_sections: mapMediaSections(values),
  media_promotions: mapMediaPromotions(values.servicePackage.servicePackages),
});

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
