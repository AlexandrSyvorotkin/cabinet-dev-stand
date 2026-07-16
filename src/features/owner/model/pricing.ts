import type { BasicServicesState } from './basic-services';
import { getEligibleBasicServiceKeys } from './basic-services';

export type AgencyDiscount = {
  enabled: boolean;
  percent: number;
};

export type PricingAddon = {
  id: string;
  name: string;
  price: string;
  enabled: boolean;
};

export type ServicePackageKind = 'discount' | 'bonus';

export type ServicePackage = {
  id: string;
  name: string;
  kind: ServicePackageKind;
  minCount: number;
  baseServiceKeys: string[];
  serviceKeys: string[];
  percent: number;
  bonusServiceKeys: string[];
};

export type PricingRules = {
  agencyDiscount: AgencyDiscount;
  addons: PricingAddon[];
  servicePackages: ServicePackage[];
};

export type PriceBreakdownLine = {
  label: string;
  amount: number;
};

export type PriceCalculationResult = {
  baseTotal: number;
  breakdown: PriceBreakdownLine[];
  finalPrice: number;
};

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createEmptyPricingRules = (): PricingRules => ({
  agencyDiscount: { enabled: false, percent: 10 },
  addons: [
    {
      id: createId(),
      name: 'Оформление ERID',
      price: '1500',
      enabled: false,
    },
  ],
  servicePackages: [],
});

export const createServicePackage = (
  kind: ServicePackageKind = 'discount',
  order = 1,
): ServicePackage => ({
  id: createId(),
  name: `Пакет услуг ${order}`,
  kind,
  minCount: 2,
  baseServiceKeys: [],
  serviceKeys: [],
  percent: 10,
  bonusServiceKeys: [],
});

export const getServicePackageLabel = (servicePackage: ServicePackage, index: number): string => {
  return servicePackage.name.trim() || `Пакет услуг ${index + 1}`;
};

export const sanitizePricingSelections = (
  basicServices: BasicServicesState,
  pricingRules: PricingRules,
): PricingRules => {
  const discountEligible = new Set(getEligibleBasicServiceKeys(basicServices, 'discount'));
  const bonusEligible = new Set(getEligibleBasicServiceKeys(basicServices, 'bonus'));

  return {
    ...pricingRules,
    servicePackages: pricingRules.servicePackages.map((servicePackage) => {
      if (servicePackage.kind === 'bonus') {
        return {
          ...servicePackage,
          serviceKeys: servicePackage.serviceKeys.filter((key) => bonusEligible.has(key)),
          bonusServiceKeys: servicePackage.bonusServiceKeys.filter((key) =>
            bonusEligible.has(key),
          ),
        };
      }

      return {
        ...servicePackage,
        baseServiceKeys: servicePackage.baseServiceKeys.filter((key) =>
          discountEligible.has(key),
        ),
        serviceKeys: servicePackage.serviceKeys.filter((key) => discountEligible.has(key)),
      };
    }),
  };
};

export const createPricingAddon = (): PricingAddon => ({
  id: createId(),
  name: '',
  price: '',
  enabled: true,
});
