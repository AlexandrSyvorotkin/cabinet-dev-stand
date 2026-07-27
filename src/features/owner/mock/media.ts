import {
  EMPTY_ADD_MEDIA_FORM,
  syncSocialNetworksWithBasicServices,
  type AddMediaFormValues,
} from '../model/add-media-form';
import type {
  BasicServiceItemConfig,
  BasicServiceRowValues,
  BasicServicesState,
} from '../model/basic-services';
import { createMediaItem, type OwnerMediaItem } from '../model/media';
import type { SocialNetworkRowValues, SocialNetworksValues } from '../model/social-networks';
import { getPlacementTypeConfig, type PlacementTypeId } from '@/shared/model/placement-types';
import {
  getSocialPlatformById,
  type SocialPlatformId,
} from '@/shared/model/social-platforms';

const MOCK_SERVICE_IDS = {
  altai: {
    article: 'placement-mock-altai-article',
    interview: 'placement-mock-altai-interview',
    vk: 'social-mock-altai-vk',
    ok: 'social-mock-altai-ok',
    max: 'social-mock-altai-max',
  },
  perm: {
    article: 'placement-mock-perm-article',
    interview: 'placement-mock-perm-interview',
    vk: 'social-mock-perm-vk',
  },
  moscow: {
    article: 'placement-mock-moscow-article',
    interview: 'placement-mock-moscow-interview',
    specialProject: 'placement-mock-moscow-special',
    vk: 'social-mock-moscow-vk',
    ok: 'social-mock-moscow-ok',
    max: 'social-mock-moscow-max',
  },
  federal: {
    article: 'placement-mock-federal-article',
    interview: 'placement-mock-federal-interview',
    vk: 'social-mock-federal-vk',
  },
} as const;

const cloneForm = (): AddMediaFormValues => structuredClone(EMPTY_ADD_MEDIA_FORM);

const createBasicServiceRow = (config: BasicServiceItemConfig): BasicServiceRowValues => ({
  maxChars: config.defaultMaxChars != null ? String(config.defaultMaxChars) : '',
  headlineLimit: config.defaultHeadline != null ? String(config.defaultHeadline) : '',
  price: config.defaultPrice != null ? String(config.defaultPrice) : '',
  bonus: false,
  discount: false,
});

type MockPlacementSpec = {
  id: string;
  placementTypeId: PlacementTypeId;
  isBuiltin?: boolean;
  patch?: Partial<BasicServiceRowValues>;
};

type MockSocialSpec = {
  id: string;
  platformId: SocialPlatformId;
  isBuiltin?: boolean;
  patch?: Partial<BasicServiceRowValues>;
};

const createMockPlacementItem = ({
  id,
  placementTypeId,
  isBuiltin = false,
}: MockPlacementSpec): BasicServiceItemConfig => {
  const type = getPlacementTypeConfig(placementTypeId);

  return {
    id,
    label: type.label,
    group: 'placement',
    isCustom: !isBuiltin,
    placementTypeId: type.id,
    defaultMaxChars: type.defaultMaxChars,
    defaultHeadline: type.defaultHeadline,
    defaultPrice: type.defaultPrice,
    hint: type.hint,
  };
};

const createMockSocialItem = ({
  id,
  platformId,
  isBuiltin = false,
}: MockSocialSpec): BasicServiceItemConfig => {
  const platform = getSocialPlatformById(platformId);

  return {
    id,
    label: platform.label,
    group: 'social',
    isCustom: !isBuiltin,
    platformId,
    defaultMaxChars: 5000,
    defaultHeadline: 50,
    defaultPrice: 5_000,
  };
};

const buildMockBasicServices = (
  placements: MockPlacementSpec[],
  socials: MockSocialSpec[],
): BasicServicesState => {
  const placementItems = placements.map(createMockPlacementItem);
  const socialItems = socials.map(createMockSocialItem);
  const items = [...placementItems, ...socialItems];
  const patches = Object.fromEntries([
    ...placements.map((entry) => [entry.id, entry.patch ?? {}]),
    ...socials.map((entry) => [entry.id, entry.patch ?? {}]),
  ]) as Record<string, Partial<BasicServiceRowValues>>;

  return {
    items,
    values: Object.fromEntries(
      items.map((item) => [
        item.id,
        { ...createBasicServiceRow(item), ...(patches[item.id] ?? {}) },
      ]),
    ),
  };
};

type ApplyMediaServicesOptions = {
  placements: MockPlacementSpec[];
  socials: MockSocialSpec[];
  socialNetworks?: Omit<Partial<SocialNetworksValues>, 'platforms'> & {
    platforms?: Record<string, Partial<SocialNetworkRowValues>>;
  };
};

const applyMediaServices = (
  form: AddMediaFormValues,
  { placements, socials, socialNetworks: socialNetworksPatch }: ApplyMediaServicesOptions,
): AddMediaFormValues => {
  const basicServices = buildMockBasicServices(placements, socials);
  const socialItemIds = socials.map((entry) => entry.id);
  let socialNetworks = syncSocialNetworksWithBasicServices(socialItemIds, form.socialNetworks);

  if (socialNetworksPatch) {
    socialNetworks = {
      ...socialNetworks,
      photo: socialNetworksPatch.photo ?? socialNetworks.photo,
      video: socialNetworksPatch.video ?? socialNetworks.video,
      platforms: Object.fromEntries(
        socialItemIds.map((id) => [
          id,
          {
            ...socialNetworks.platforms[id],
            ...(socialNetworksPatch.platforms?.[id] ?? {}),
          },
        ]),
      ),
    };
  }

  return {
    ...form,
    basicServices,
    socialNetworks,
  };
};

const withRkn = (
  row: Partial<SocialNetworkRowValues>,
  number: string,
): Partial<SocialNetworkRowValues> => ({
  ...row,
  rknRegistered: true,
  rknNumber: number,
});

const createAltaiInfoForm = (): AddMediaFormValues => {
  const ids = MOCK_SERVICE_IDS.altai;

  return applyMediaServices(
    {
      ...cloneForm(),
      name: 'Алтай-инфо',
      url: 'https://altai-info.ru',
      region: 'Республика Алтай',
      city: 'Горно-Алтайск',
      coverage: 'Региональное',
      trafficReach: '45 000 в месяц',
      pricingRules: {
        agencyDiscount: { enabled: true, percent: 15 },
        addons: [
          {
            id: 'mock-addon-erid',
            name: 'Оформление ERID',
            price: '1500',
            enabled: true,
          },
        ],
        servicePackages: [
          {
            id: 'mock-pkg-discount-1',
            name: 'Пакет услуг 1',
            kind: 'discount',
            minCount: 2,
            baseServiceKeys: ['telegram'],
            discountedServices: [
              {
                id: 'mock-discounted-1',
                serviceKeys: [ids.ok, ids.max],
                percent: 70,
              },
            ],
            serviceKeys: [],
            percent: 0,
            bonusServiceKeys: [],
          },
          {
            id: 'mock-pkg-bonus-1',
            name: 'Пакет услуг 2',
            kind: 'bonus',
            minCount: 2,
            baseServiceKeys: [],
            discountedServices: [],
            serviceKeys: [ids.interview],
            percent: 0,
            bonusServiceKeys: [ids.vk, ids.ok],
          },
        ],
      },
    },
    {
      placements: [
        {
          id: 'news',
          placementTypeId: 'news',
          isBuiltin: true,
          patch: { discount: true, bonus: false },
        },
        {
          id: ids.article,
          placementTypeId: 'article',
          patch: { discount: true, bonus: true },
        },
        {
          id: ids.interview,
          placementTypeId: 'interview',
          patch: { discount: true, bonus: true },
        },
      ],
      socials: [
        {
          id: 'telegram',
          platformId: 'telegram',
          isBuiltin: true,
          patch: { discount: true, bonus: true },
        },
        {
          id: ids.vk,
          platformId: 'vk',
          patch: { discount: true, bonus: true },
        },
        {
          id: ids.ok,
          platformId: 'odnoklassniki',
          patch: { discount: true, bonus: true },
        },
        {
          id: ids.max,
          platformId: 'max',
          patch: { discount: true, bonus: false },
        },
      ],
      socialNetworks: {
        photo: true,
        video: false,
        platforms: {
          telegram: { reachOrSubscribers: '18 500', link: 'https://t.me/altai_info' },
          [ids.vk]: { reachOrSubscribers: '12 000', link: 'https://vk.com/altai_info' },
          [ids.ok]: { reachOrSubscribers: '6 400', link: 'https://ok.ru/altai_info' },
          [ids.max]: { reachOrSubscribers: '3 200', link: 'https://max.ru/altai_info' },
        },
      },
    },
  );
};

const createPermGazetaForm = (): AddMediaFormValues => {
  const ids = MOCK_SERVICE_IDS.perm;

  return applyMediaServices(
    {
      ...cloneForm(),
      name: 'Пермская газета',
      url: 'https://perm-gazeta.ru',
      region: 'Пермский край',
      city: 'Пермь',
      coverage: 'Региональное',
      trafficReach: '120 000 в месяц',
      pricingRules: {
        agencyDiscount: { enabled: false, percent: 10 },
        addons: [
          {
            id: 'mock-addon-erid-2',
            name: 'Оформление ERID',
            price: '1500',
            enabled: false,
          },
        ],
        servicePackages: [
          {
            id: 'mock-pkg-bonus-2',
            name: 'Бонус за объём',
            kind: 'bonus',
            minCount: 3,
            baseServiceKeys: [],
            discountedServices: [],
            serviceKeys: ['news', ids.article],
            percent: 0,
            bonusServiceKeys: ['telegram'],
          },
        ],
      },
    },
    {
      placements: [
        {
          id: 'news',
          placementTypeId: 'news',
          isBuiltin: true,
          patch: { price: '7500', discount: true, bonus: true },
        },
        {
          id: ids.article,
          placementTypeId: 'article',
          patch: { price: '22000', discount: true, bonus: true },
        },
        {
          id: ids.interview,
          placementTypeId: 'interview',
          patch: { price: '32000', discount: false, bonus: true },
        },
      ],
      socials: [
        {
          id: 'telegram',
          platformId: 'telegram',
          isBuiltin: true,
          patch: { price: '4800', discount: true, bonus: true },
        },
        {
          id: ids.vk,
          platformId: 'vk',
          patch: { price: '4200', discount: true, bonus: false },
        },
      ],
      socialNetworks: {
        photo: false,
        video: true,
        platforms: {
          telegram: { reachOrSubscribers: '25 000', link: 'https://t.me/perm_gazeta' },
          [ids.vk]: withRkn(
            { reachOrSubscribers: '31 000', link: 'https://vk.com/perm_gazeta' },
            '77-012345',
          ),
        },
      },
    },
  );
};

const createMoscow24Form = (): AddMediaFormValues => {
  const ids = MOCK_SERVICE_IDS.moscow;

  return applyMediaServices(
    {
      ...cloneForm(),
      name: 'Москва 24',
      url: 'https://moscow24.ru',
      region: 'Москва',
      coverage: 'Федеральное',
      trafficReach: '2 500 000 в месяц',
      pricingRules: {
        agencyDiscount: { enabled: true, percent: 20 },
        addons: [
          {
            id: 'mock-addon-erid-3',
            name: 'Оформление ERID',
            price: '2000',
            enabled: true,
          },
          {
            id: 'mock-addon-photo',
            name: 'Фотосъёмка',
            price: '8000',
            enabled: true,
          },
        ],
        servicePackages: [
          {
            id: 'mock-pkg-discount-3',
            name: 'Скидка на соцсети',
            kind: 'discount',
            minCount: 2,
            baseServiceKeys: ['news'],
            discountedServices: [
              {
                id: 'mock-discounted-3',
                serviceKeys: ['telegram', ids.vk, ids.ok],
                percent: 50,
              },
            ],
            serviceKeys: [],
            percent: 0,
            bonusServiceKeys: [],
          },
        ],
      },
    },
    {
      placements: [
        {
          id: 'news',
          placementTypeId: 'news',
          isBuiltin: true,
          patch: { price: '15000', discount: true, bonus: false },
        },
        {
          id: ids.article,
          placementTypeId: 'article',
          patch: { price: '45000', discount: true, bonus: false },
        },
        {
          id: ids.interview,
          placementTypeId: 'interview',
          patch: { price: '60000', discount: true, bonus: true },
        },
        {
          id: ids.specialProject,
          placementTypeId: 'specialProject',
          patch: { price: '250000', discount: false, bonus: false },
        },
      ],
      socials: [
        {
          id: 'telegram',
          platformId: 'telegram',
          isBuiltin: true,
          patch: { price: '12000', discount: true, bonus: false },
        },
        {
          id: ids.vk,
          platformId: 'vk',
          patch: { price: '10000', discount: true, bonus: false },
        },
        {
          id: ids.ok,
          platformId: 'odnoklassniki',
          patch: { price: '9000', discount: true, bonus: false },
        },
        {
          id: ids.max,
          platformId: 'max',
          patch: { price: '9000', discount: true, bonus: false },
        },
      ],
      socialNetworks: {
        photo: true,
        video: true,
        platforms: {
          telegram: withRkn(
            { reachOrSubscribers: '890 000', link: 'https://t.me/moscow24' },
            '77-100001',
          ),
          [ids.vk]: withRkn(
            { reachOrSubscribers: '1 200 000', link: 'https://vk.com/moscow24' },
            '77-100002',
          ),
          [ids.ok]: withRkn(
            { reachOrSubscribers: '340 000', link: 'https://ok.ru/moscow24' },
            '77-100003',
          ),
          [ids.max]: withRkn(
            { reachOrSubscribers: '150 000', link: 'https://max.ru/moscow24' },
            '77-100004',
          ),
        },
      },
    },
  );
};

const createFederalPortalForm = (): AddMediaFormValues => {
  const ids = MOCK_SERVICE_IDS.federal;

  return applyMediaServices(
    {
      ...cloneForm(),
      name: 'Федеральный аналитический портал',
      url: 'https://federal-analytics.ru',
      region: 'Казахстан',
      city: 'Астана',
      coverage: 'Международное',
      trafficReach: '800 000 в месяц',
      reportsEnabled: true,
      validityPeriod: '12 месяцев',
      pricingRules: {
        agencyDiscount: { enabled: true, percent: 12 },
        addons: [
          {
            id: 'mock-addon-erid-4',
            name: 'Оформление ERID',
            price: '1500',
            enabled: false,
          },
        ],
        servicePackages: [],
      },
    },
    {
      placements: [
        {
          id: 'news',
          placementTypeId: 'news',
          isBuiltin: true,
          patch: { price: '12000', discount: true, bonus: true },
        },
        {
          id: ids.article,
          placementTypeId: 'article',
          patch: { price: '35000', discount: true, bonus: true },
        },
        {
          id: ids.interview,
          placementTypeId: 'interview',
          patch: { price: '50000', discount: true, bonus: true },
        },
      ],
      socials: [
        {
          id: 'telegram',
          platformId: 'telegram',
          isBuiltin: true,
          patch: { price: '8000', discount: true, bonus: true },
        },
        {
          id: ids.vk,
          platformId: 'vk',
          patch: { price: '7000', discount: true, bonus: true },
        },
      ],
      socialNetworks: {
        photo: true,
        video: true,
        platforms: {
          telegram: withRkn(
            { reachOrSubscribers: '210 000', link: 'https://t.me/federal_analytics' },
            'KZ-200001',
          ),
          [ids.vk]: withRkn(
            { reachOrSubscribers: '180 000', link: 'https://vk.com/federal_analytics' },
            'KZ-200002',
          ),
        },
      },
    },
  );
};

const MOCK_OWNER_MEDIA: OwnerMediaItem[] = [
  createMediaItem(createAltaiInfoForm(), {
    id: 1001,
    tab: 'created',
    statusLabel: 'Создано',
  }),
  createMediaItem(createPermGazetaForm(), {
    id: 1002,
    tab: 'created',
    statusLabel: 'Создано',
  }),
  createMediaItem(createMoscow24Form(), {
    id: 1003,
    tab: 'moderation',
    statusLabel: 'На модерации',
  }),
  createMediaItem(createFederalPortalForm(), {
    id: 1004,
    tab: 'active',
    statusLabel: 'Активно',
  }),
];

export { MOCK_OWNER_MEDIA };
