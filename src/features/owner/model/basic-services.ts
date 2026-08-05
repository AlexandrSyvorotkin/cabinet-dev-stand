import {
  isSocialPlatformId,
  SOCIAL_PLATFORMS,
  type SocialPlatformId,
} from '@/shared/model/social-platforms';
import {
  getPlacementTypeConfig,
  isPlacementTypeId,
  PLACEMENT_TYPES,
  type PlacementTypeId,
} from '@/shared/model/placement-types';

export type { PlacementTypeId } from '@/shared/model/placement-types';
export { PLACEMENT_TYPE_OPTIONS } from '@/shared/model/placement-types';

export type BasicServiceItem = {
  id: string;
  label: string;
  group: 'placement' | 'social';
  isCustom: boolean;
  placementTypeId?: PlacementTypeId;
  platformId?: SocialPlatformId;
  hint?: string;
  maxChars: string;
  headlineLimit: string;
  price: string;
  bonus: boolean;
  discount: boolean;
};

/** @deprecated Используйте BasicServiceItem */
export type BasicServiceItemConfig = BasicServiceItem;

/** @deprecated Используйте Partial<Pick<BasicServiceItem, ...>> */
export type BasicServiceRowValues = Pick<
  BasicServiceItem,
  'maxChars' | 'headlineLimit' | 'price' | 'bonus' | 'discount'
>;

export type BasicServicesState = {
  items: BasicServiceItem[];
};

/** @deprecated Используйте string id из BasicServicesState */
export type BasicServiceKey = string;

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createRowValues = (defaults: {
  maxChars?: number | null;
  headlineLimit?: number | null;
  price?: number | null;
}): Pick<BasicServiceItem, 'maxChars' | 'headlineLimit' | 'price' | 'bonus' | 'discount'> => ({
  maxChars: defaults.maxChars != null ? String(defaults.maxChars) : '',
  headlineLimit: defaults.headlineLimit != null ? String(defaults.headlineLimit) : '',
  price: defaults.price != null ? String(defaults.price) : '',
  bonus: false,
  discount: false,
});

const createPlacementItem = (type: ReturnType<typeof getPlacementTypeConfig>): BasicServiceItem => ({
  id: type.id,
  label: type.label,
  group: 'placement',
  isCustom: false,
  placementTypeId: type.id,
  hint: type.hint,
  ...createRowValues({
    maxChars: type.defaultMaxChars,
    headlineLimit: type.defaultHeadline,
    price: type.defaultPrice,
  }),
});

export const getPlacementTypeId = (item: BasicServiceItem): PlacementTypeId | null => {
  if (item.placementTypeId) {
    return item.placementTypeId;
  }

  if (item.group === 'placement' && !item.isCustom && isPlacementTypeId(item.id)) {
    return item.id;
  }

  return null;
};

export const isMaxCharsDisabled = (item: BasicServiceItem): boolean => {
  if (item.group !== 'placement') {
    return false;
  }

  const placementTypeId = getPlacementTypeId(item);
  return placementTypeId ? getPlacementTypeConfig(placementTypeId).defaultMaxChars === null : false;
};

export const isHeadlineLimitDisabled = (item: BasicServiceItem): boolean => {
  if (item.group !== 'placement') {
    return false;
  }

  const placementTypeId = getPlacementTypeId(item);
  return placementTypeId ? getPlacementTypeConfig(placementTypeId).defaultHeadline === null : false;
};

export const BUILTIN_BASIC_SERVICES_CONFIG: BasicServiceItem[] = [
  createPlacementItem(getPlacementTypeConfig(PLACEMENT_TYPES[0]!.id)),
  {
    id: 'telegram',
    label: 'ТГ',
    group: 'social',
    isCustom: false,
    ...createRowValues({
      maxChars: 5000,
      headlineLimit: 50,
      price: 5_000,
    }),
  },
];

export const BASIC_SERVICE_OPTIONS = BUILTIN_BASIC_SERVICES_CONFIG.map((item) => ({
  value: item.id,
  label: item.label,
}));

export const createEmptyBasicServices = (): BasicServicesState => ({
  items: BUILTIN_BASIC_SERVICES_CONFIG.map((item) => ({ ...item })),
});

export const createCustomPlacementService = (_order: number): BasicServiceItem => {
  const typeConfig = getPlacementTypeConfig('news');

  return {
    id: `placement-${createId()}`,
    label: '',
    group: 'placement',
    isCustom: true,
    placementTypeId: 'news',
    hint: typeConfig.hint,
    ...createRowValues({
      maxChars: typeConfig.defaultMaxChars,
      headlineLimit: typeConfig.defaultHeadline,
      price: typeConfig.defaultPrice,
    }),
  };
};

export const createCustomSocialService = (): BasicServiceItem => ({
  id: `social-${createId()}`,
  label: '',
  group: 'social',
  isCustom: true,
  ...createRowValues({
    maxChars: 5000,
    headlineLimit: 50,
    price: null,
  }),
});

export const updateBasicServiceItem = (
  state: BasicServicesState,
  id: string,
  patch: Partial<BasicServiceItem>,
): BasicServicesState => ({
  items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
});

export const addCustomPlacementService = (state: BasicServicesState): BasicServicesState => {
  const placementCount = state.items.filter((item) => item.group === 'placement').length;
  const newItem = createCustomPlacementService(placementCount + 1);

  return {
    items: [...state.items, newItem],
  };
};

export const addCustomSocialService = (state: BasicServicesState): BasicServicesState => {
  const newItem = createCustomSocialService();

  return {
    items: [...state.items, newItem],
  };
};

export const removeBasicService = (
  state: BasicServicesState,
  id: string,
): BasicServicesState | null => {
  const item = state.items.find((entry) => entry.id === id);

  if (!item) {
    return state;
  }

  const groupCount = state.items.filter((entry) => entry.group === item.group).length;

  if (groupCount <= 1) {
    return null;
  }

  return {
    items: state.items.filter((entry) => entry.id !== id),
  };
};

export const canRemoveBasicService = (state: BasicServicesState, id: string): boolean => {
  const item = state.items.find((entry) => entry.id === id);

  if (!item) {
    return false;
  }

  return state.items.filter((entry) => entry.group === item.group).length > 1;
};

export const updateBasicServiceLabel = (
  state: BasicServicesState,
  id: string,
  label: string,
): BasicServicesState => updateBasicServiceItem(state, id, { label });

export const updatePlacementType = (
  state: BasicServicesState,
  id: string,
  placementTypeId: PlacementTypeId,
): BasicServicesState => {
  const typeConfig = getPlacementTypeConfig(placementTypeId);

  return updateBasicServiceItem(state, id, {
    placementTypeId,
    hint: typeConfig.hint,
    maxChars: typeConfig.defaultMaxChars != null ? String(typeConfig.defaultMaxChars) : '',
    headlineLimit: typeConfig.defaultHeadline != null ? String(typeConfig.defaultHeadline) : '',
    price: typeConfig.defaultPrice != null ? String(typeConfig.defaultPrice) : '',
  });
};

export const getSocialPlatformId = (item: BasicServiceItem): SocialPlatformId | null => {
  if (item.platformId) {
    return item.platformId;
  }

  if (item.group === 'social' && isSocialPlatformId(item.id)) {
    return item.id;
  }

  return null;
};

export const getUsedSocialPlatformIds = (
  state: BasicServicesState,
  excludeItemId?: string,
): SocialPlatformId[] =>
  state.items
    .filter((item) => item.group === 'social' && item.id !== excludeItemId)
    .map(getSocialPlatformId)
    .filter((platformId): platformId is SocialPlatformId => platformId !== null);

export const updateSocialPlatform = (
  state: BasicServicesState,
  id: string,
  platformId: SocialPlatformId,
): BasicServicesState => updateBasicServiceItem(state, id, { platformId });

export const canAddSocialPlatform = (state: BasicServicesState): boolean =>
  getSocialItems(state).length < SOCIAL_PLATFORMS.length;

export const getPlacementItems = (state: BasicServicesState): BasicServiceItem[] =>
  state.items.filter((item) => item.group === 'placement');

export const getSocialItems = (state: BasicServicesState): BasicServiceItem[] =>
  state.items.filter((item) => item.group === 'social');

export const getBasicServiceLabelsMap = (items: BasicServiceItem[]): Record<string, string> =>
  Object.fromEntries(items.map((item) => [item.id, item.label]));

export type BasicServiceSelectFlag = 'bonus' | 'discount';

export const getBasicServiceSelectOptions = (
  basicServices: BasicServicesState,
  flag: BasicServiceSelectFlag,
) => {
  return basicServices.items
    .filter((item) => item[flag])
    .map((item) => ({
      value: item.id,
      label: item.label,
    }));
};

export const getEligibleBasicServiceKeys = (
  basicServices: BasicServicesState,
  flag: BasicServiceSelectFlag,
): string[] => {
  return basicServices.items.filter((item) => item[flag]).map((item) => item.id);
};
