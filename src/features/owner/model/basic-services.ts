import {
  getSocialPlatformById,
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

export type BasicServiceRowValues = {
  maxChars: string;
  headlineLimit: string;
  price: string;
  bonus: boolean;
  discount: boolean;
};

export type BasicServiceItemConfig = {
  id: string;
  label: string;
  group: 'placement' | 'social';
  isCustom: boolean;
  placementTypeId?: PlacementTypeId;
  platformId?: SocialPlatformId;
  defaultMaxChars?: number | null;
  defaultHeadline?: number | null;
  defaultPrice?: number | null;
  hint?: string;
};

export type BasicServicesState = {
  items: BasicServiceItemConfig[];
  values: Record<string, BasicServiceRowValues>;
};

/** @deprecated Используйте string id из BasicServicesState */
export type BasicServiceKey = string;

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const PLACEMENT_TYPE_CONFIGS: BasicServiceItemConfig[] = PLACEMENT_TYPES.map((type) => ({
  id: type.id,
  label: type.label,
  group: 'placement' as const,
  isCustom: false,
  placementTypeId: type.id,
  defaultMaxChars: type.defaultMaxChars,
  defaultHeadline: type.defaultHeadline,
  defaultPrice: type.defaultPrice,
  hint: type.hint,
}));

export const getPlacementTypeId = (
  config: BasicServiceItemConfig,
): PlacementTypeId | null => {
  if (config.placementTypeId) {
    return config.placementTypeId;
  }

  if (config.group === 'placement' && !config.isCustom && isPlacementTypeId(config.id)) {
    return config.id;
  }

  return null;
};

export const BUILTIN_BASIC_SERVICES_CONFIG: BasicServiceItemConfig[] = [
  ...PLACEMENT_TYPE_CONFIGS,
  {
    id: 'telegram',
    label: 'ТГ',
    group: 'social',
    isCustom: false,
    defaultMaxChars: 5000,
    defaultHeadline: 50,
    defaultPrice: 5_000,
  },
  {
    id: 'vk',
    label: 'VK',
    group: 'social',
    isCustom: false,
    defaultMaxChars: 5000,
    defaultHeadline: 50,
    defaultPrice: 4_500,
  },
  {
    id: 'odnoklassniki',
    label: 'OK',
    group: 'social',
    isCustom: false,
    defaultMaxChars: 5000,
    defaultHeadline: 50,
    defaultPrice: 4_000,
  },
  {
    id: 'max',
    label: 'MAX',
    group: 'social',
    isCustom: false,
    defaultMaxChars: 5000,
    defaultHeadline: 50,
    defaultPrice: 4_000,
  },
];

export const BASIC_SERVICE_OPTIONS = BUILTIN_BASIC_SERVICES_CONFIG.map((item) => ({
  value: item.id,
  label: item.label,
}));

const createBasicServiceRow = (config: BasicServiceItemConfig): BasicServiceRowValues => ({
  maxChars: config.defaultMaxChars != null ? String(config.defaultMaxChars) : '',
  headlineLimit: config.defaultHeadline != null ? String(config.defaultHeadline) : '',
  price: config.defaultPrice != null ? String(config.defaultPrice) : '',
  bonus: false,
  discount: false,
});

export const createEmptyBasicServices = (): BasicServicesState => {
  const items = [...BUILTIN_BASIC_SERVICES_CONFIG];

  return {
    items,
    values: items.reduce(
      (acc, config) => {
        acc[config.id] = createBasicServiceRow(config);
        return acc;
      },
      {} as Record<string, BasicServiceRowValues>,
    ),
  };
};

export const createCustomPlacementService = (_order: number): BasicServiceItemConfig => {
  const defaultType = getPlacementTypeConfig('news');

  return {
    id: `placement-${createId()}`,
    label: defaultType.label,
    group: 'placement',
    isCustom: true,
    placementTypeId: 'news',
    defaultMaxChars: defaultType.defaultMaxChars,
    defaultHeadline: defaultType.defaultHeadline,
    defaultPrice: defaultType.defaultPrice,
  };
};

export const createCustomSocialService = (): BasicServiceItemConfig => ({
  id: `social-${createId()}`,
  label: '',
  group: 'social',
  isCustom: true,
  defaultMaxChars: 5000,
  defaultHeadline: 50,
  defaultPrice: null,
});

export const addCustomPlacementService = (state: BasicServicesState): BasicServicesState => {
  const placementCount = state.items.filter((item) => item.group === 'placement').length;
  const newItem = createCustomPlacementService(placementCount + 1);

  return {
    items: [...state.items, newItem],
    values: {
      ...state.values,
      [newItem.id]: createBasicServiceRow(newItem),
    },
  };
};

export const addCustomSocialService = (state: BasicServicesState): BasicServicesState => {
  const newItem = createCustomSocialService();

  return {
    items: [...state.items, newItem],
    values: {
      ...state.values,
      [newItem.id]: createBasicServiceRow(newItem),
    },
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

  const { [id]: _removed, ...restValues } = state.values;

  return {
    items: state.items.filter((entry) => entry.id !== id),
    values: restValues,
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
): BasicServicesState => ({
  ...state,
  items: state.items.map((item) => (item.id === id ? { ...item, label } : item)),
});

export const updatePlacementType = (
  state: BasicServicesState,
  id: string,
  placementTypeId: PlacementTypeId,
): BasicServicesState => {
  const typeConfig = getPlacementTypeConfig(placementTypeId);

  return {
    ...state,
    items: state.items.map((item) =>
      item.id === id
        ? {
            ...item,
            placementTypeId,
            label: typeConfig.label,
            defaultMaxChars: typeConfig.defaultMaxChars,
            defaultHeadline: typeConfig.defaultHeadline,
            defaultPrice: typeConfig.defaultPrice,
            hint: typeConfig.hint,
          }
        : item,
    ),
  };
};

export const getSocialPlatformId = (
  config: BasicServiceItemConfig,
): SocialPlatformId | null => {
  if (config.platformId) {
    return config.platformId;
  }

  if (config.group === 'social' && isSocialPlatformId(config.id)) {
    return config.id;
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
): BasicServicesState => {
  const platform = getSocialPlatformById(platformId);

  return {
    ...state,
    items: state.items.map((item) =>
      item.id === id ? { ...item, platformId, label: platform.label } : item,
    ),
  };
};

export const canAddSocialPlatform = (state: BasicServicesState): boolean =>
  getSocialItems(state).length < SOCIAL_PLATFORMS.length;

export const getPlacementItems = (state: BasicServicesState): BasicServiceItemConfig[] =>
  state.items.filter((item) => item.group === 'placement');

export const getSocialItems = (state: BasicServicesState): BasicServiceItemConfig[] =>
  state.items.filter((item) => item.group === 'social');

export const getBasicServiceLabelsMap = (
  items: BasicServiceItemConfig[],
): Record<string, string> =>
  Object.fromEntries(items.map((item) => [item.id, item.label]));

export type BasicServiceSelectFlag = 'bonus' | 'discount';

export const getBasicServiceSelectOptions = (
  basicServices: BasicServicesState,
  flag: BasicServiceSelectFlag,
) => {
  return basicServices.items
    .filter((item) => basicServices.values[item.id]?.[flag])
    .map((item) => ({
      value: item.id,
      label: item.label,
    }));
};

export const getEligibleBasicServiceKeys = (
  basicServices: BasicServicesState,
  flag: BasicServiceSelectFlag,
): string[] => {
  return basicServices.items
    .filter((item) => basicServices.values[item.id]?.[flag])
    .map((item) => item.id);
};
