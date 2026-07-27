import type { BasicServicesState } from './basic-services';
import { createEmptyBasicServices, type BasicServiceItemConfig } from './basic-services';
import { createEmptyPricingRules, type PricingRules } from './pricing';
import {
  createEmptySocialNetworks,
  syncSocialNetworksWithBasicServices,
  type SocialNetworksValues,
} from './social-networks';

export type {
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
  removeBasicService,
  updateBasicServiceLabel,
  updatePlacementType,
  updateSocialPlatform,
} from './basic-services';
export type { SocialNetworkRowValues, SocialNetworksValues } from './social-networks';
export {
  createEmptySocialNetworks,
  hasNonCompliantRknPlatforms,
  isSocialPlatformActive,
  parseSubscriberCount,
  requiresRknCompliance,
  RKN_SUBSCRIBER_THRESHOLD,
  syncSocialNetworksWithBasicServices,
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
  createEmptyPricingRules,
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
  region: string;
  city: string;
  coverage: string;
  themes: string[];
  trafficReach: string;
  yandexSearch: boolean;
  googleSearch: boolean;
  auditoryOther: string;
  hasErid: boolean;
  eridToken: string;
  reportsEnabled: boolean;
  validityPeriod: string;
  pricingRules: PricingRules;
  basicServices: BasicServicesState;
  socialNetworks: SocialNetworksValues;
};

export type MediaBasicServicePayload = BasicServiceItemConfig & {
  maxChars: string;
  headlineLimit: string;
  price: string;
  availableForDiscount: boolean;
  availableForBonus: boolean;
};

export type CreateMediaPayload = Omit<AddMediaFormValues, 'basicServices'> & {
  basicServices: MediaBasicServicePayload[];
};

export const serializeCreateMediaPayload = (values: AddMediaFormValues): CreateMediaPayload => {
  const { basicServices, ...rest } = values;

  return {
    ...rest,
    basicServices: basicServices.items.map((item) => {
      const row = basicServices.values[item.id] ?? {
        maxChars: '',
        headlineLimit: '',
        price: '',
        bonus: false,
        discount: false,
      };

      return {
        ...item,
        maxChars: row.maxChars,
        headlineLimit: row.headlineLimit,
        price: row.price,
        availableForDiscount: row.discount,
        availableForBonus: row.bonus,
      };
    }),
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
    region: '',
    city: '',
    coverage: FEDERAL_MEDIA_COVERAGE,
    themes: [],
    trafficReach: '',
    yandexSearch: false,
    googleSearch: false,
    auditoryOther: '',
    hasErid: false,
    eridToken: '',
    reportsEnabled: false,
    validityPeriod: '',
    pricingRules: createEmptyPricingRules(),
    basicServices,
    socialNetworks: syncSocialNetworksWithBasicServices(socialIds, createEmptySocialNetworks()),
  };
})();
