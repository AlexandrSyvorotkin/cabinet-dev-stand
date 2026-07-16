import type { BasicServicesState } from './basic-services';
import { createEmptyBasicServices } from './basic-services';
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
  getSocialItems,
  removeBasicService,
  updateBasicServiceLabel,
  updateSocialPlatform,
} from './basic-services';
export type { SocialNetworkRowValues, SocialNetworksValues } from './social-networks';
export {
  createEmptySocialNetworks,
  syncSocialNetworksWithBasicServices,
} from './social-networks';
export type { PricingAddon, PricingRules, ServicePackage, ServicePackageKind } from './pricing';
export {
  createEmptyPricingRules,
  createPricingAddon,
  createServicePackage,
  getServicePackageLabel,
  sanitizePricingSelections,
} from './pricing';

export type AddMediaFormValues = {
  name: string;
  url: string;
  region: string;
  coverage: string;
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

export const MEDIA_REGIONS = [
  'Республика Алтай',
  'Пермский край',
  'Москва',
  'Санкт-Петербург',
];

export const MEDIA_COVERAGE_LEVELS = [
  'Региональное',
  'Федеральное',
  'Международное',
];

export const EMPTY_ADD_MEDIA_FORM: AddMediaFormValues = (() => {
  const basicServices = createEmptyBasicServices();
  const socialIds = basicServices.items
    .filter((item) => item.group === 'social')
    .map((item) => item.id);

  return {
    name: '',
    url: '',
    region: MEDIA_REGIONS[0] ?? '',
    coverage: MEDIA_COVERAGE_LEVELS[0] ?? '',
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
