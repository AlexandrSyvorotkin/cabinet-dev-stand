import type {
  AgencyDiscount,
  PriceBreakdownLine,
  PriceCalculationResult,
  PricingAddon,
  PricingRules,
  ServicePackage,
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
  const discountedKeys = servicePackage.serviceKeys.filter((key) =>
    selectedServiceKeys.includes(key),
  );

  if (baseKeys.length === 0 || discountedKeys.length < servicePackage.minCount) {
    return null;
  }

  const discountSaved = discountedKeys.reduce((sum, key) => {
    const price = servicePrices[key] ?? 0;
    return sum + Math.round((price * servicePackage.percent) / 100);
  }, 0);

  if (discountSaved <= 0) {
    return null;
  }

  return {
    amount: discountSaved,
    label: `${packageLabel}: скидка −${servicePackage.percent}% на доп. услуги`,
  };
};

const getBestServicePackageDiscount = (
  rules: PricingRules,
  selectedServiceKeys: string[],
  servicePrices: Partial<Record<string, number>>,
  activePackageIds?: string[],
): PriceBreakdownLine | null => {
  const servicePackages = activePackageIds
    ? rules.servicePackages.filter((servicePackage) =>
        activePackageIds.includes(servicePackage.id),
      )
    : rules.servicePackages;

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

  const matchedTriggers = servicePackage.serviceKeys.filter((key) =>
    selectedServiceKeys.includes(key),
  );

  if (matchedTriggers.length < servicePackage.minCount) {
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
    ? rules.servicePackages.filter((servicePackage) =>
        activePackageIds.includes(servicePackage.id),
      )
    : rules.servicePackages;

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
    return [...new Set([...servicePackage.baseServiceKeys, ...servicePackage.serviceKeys])];
  }

  const keys = new Set(servicePackage.serviceKeys);

  if (servicePackage.kind === 'bonus') {
    for (const key of servicePackage.bonusServiceKeys) {
      keys.add(key);
    }
  }

  return [...keys];
};

const calculateDiscountServicePackagePreview = ({
  servicePackage,
  servicePrices,
  agencyDiscount,
}: {
  servicePackage: ServicePackage;
  servicePrices: Partial<Record<string, number>>;
  agencyDiscount: AgencyDiscount;
}): PriceCalculationResult | null => {
  const { baseServiceKeys, serviceKeys: discountedKeys, minCount, percent } = servicePackage;

  if (baseServiceKeys.length === 0 && discountedKeys.length === 0) {
    return null;
  }

  const effectivePrices = getEffectiveServicePrices(servicePrices, agencyDiscount);
  const packageApplies = baseServiceKeys.length > 0 && discountedKeys.length >= minCount;

  const baseAmount = baseServiceKeys.reduce(
    (sum, key) => sum + (effectivePrices[key] ?? 0),
    0,
  );

  const discountedAmount = discountedKeys.reduce((sum, key) => {
    const price = effectivePrices[key] ?? 0;

    if (packageApplies) {
      return sum + Math.round(price * (1 - percent / 100));
    }

    return sum + price;
  }, 0);

  const breakdown: PriceBreakdownLine[] = [];

  if (baseAmount > 0) {
    breakdown.push({
      label: agencyDiscount.enabled
        ? `Базовые услуги (скидка агентству −${agencyDiscount.percent}%)`
        : 'Базовые услуги',
      amount: baseAmount,
    });
  }

  if (discountedKeys.length > 0) {
    breakdown.push({
      label: packageApplies ? `Услуги со скидкой (−${percent}%)` : 'Услуги со скидкой',
      amount: discountedAmount,
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
      servicePackage,
      servicePrices,
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
