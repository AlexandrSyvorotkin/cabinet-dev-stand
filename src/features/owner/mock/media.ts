import {
  EMPTY_ADD_MEDIA_FORM,
  type AddMediaFormValues,
} from '../model/add-media-form';
import type { BasicServiceRowValues } from '../model/basic-services';
import { createMediaItem, type OwnerMediaItem } from '../model/media';
import type { SocialNetworksValues } from '../model/social-networks';

const cloneForm = (): AddMediaFormValues => structuredClone(EMPTY_ADD_MEDIA_FORM);

const patchBasicServiceRows = (
  form: AddMediaFormValues,
  patches: Record<string, Partial<BasicServiceRowValues>>,
): AddMediaFormValues => ({
  ...form,
  basicServices: {
    ...form.basicServices,
    values: Object.fromEntries(
      Object.entries(form.basicServices.values).map(([id, row]) => [
        id,
        { ...row, ...(patches[id] ?? {}) },
      ]),
    ),
  },
});

const patchSocialNetworks = (
  form: AddMediaFormValues,
  patch: Partial<SocialNetworksValues> & {
    platforms?: Record<string, { reachOrSubscribers: string; link: string }>;
  },
): AddMediaFormValues => ({
  ...form,
  socialNetworks: {
    ...form.socialNetworks,
    ...patch,
    platforms: {
      ...form.socialNetworks.platforms,
      ...(patch.platforms ?? {}),
    },
  },
});

const createAltaiInfoForm = (): AddMediaFormValues => {
  let form = cloneForm();

  form = {
    ...form,
    name: 'Алтай-инфо',
    url: 'https://altai-info.ru',
    region: 'Республика Алтай',
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
              serviceKeys: ['odnoklassniki', 'max'],
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
          serviceKeys: ['interview'],
          percent: 0,
          bonusServiceKeys: ['vk', 'odnoklassniki'],
        },
      ],
    },
  };

  form = patchBasicServiceRows(form, {
    news: { discount: true, bonus: false },
    article: { discount: true, bonus: true },
    interview: { discount: true, bonus: true },
    specialProject: { discount: false, bonus: false },
    telegram: { discount: true, bonus: true },
    vk: { discount: true, bonus: true },
    odnoklassniki: { discount: true, bonus: true },
    max: { discount: true, bonus: false },
  });

  return patchSocialNetworks(form, {
    photo: true,
    video: false,
    platforms: {
      telegram: { reachOrSubscribers: '18 500', link: 'https://t.me/altai_info' },
      vk: { reachOrSubscribers: '12 000', link: 'https://vk.com/altai_info' },
      odnoklassniki: { reachOrSubscribers: '6 400', link: 'https://ok.ru/altai_info' },
      max: { reachOrSubscribers: '3 200', link: 'https://max.ru/altai_info' },
    },
  });
};

const createPermGazetaForm = (): AddMediaFormValues => {
  let form = cloneForm();

  form = {
    ...form,
    name: 'Пермская газета',
    url: 'https://perm-gazeta.ru',
    region: 'Пермский край',
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
          serviceKeys: ['news', 'article'],
          percent: 0,
          bonusServiceKeys: ['telegram'],
        },
      ],
    },
  };

  form = patchBasicServiceRows(form, {
    news: { price: '7500', discount: true, bonus: true },
    article: { price: '22000', discount: true, bonus: true },
    interview: { price: '32000', discount: false, bonus: true },
    telegram: { price: '4800', discount: true, bonus: true },
    vk: { price: '4200', discount: true, bonus: false },
  });

  return patchSocialNetworks(form, {
    photo: false,
    video: true,
    platforms: {
      telegram: { reachOrSubscribers: '25 000', link: 'https://t.me/perm_gazeta' },
      vk: { reachOrSubscribers: '31 000', link: 'https://vk.com/perm_gazeta' },
    },
  });
};

const createMoscow24Form = (): AddMediaFormValues => {
  let form = cloneForm();

  form = {
    ...form,
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
              serviceKeys: ['telegram', 'vk', 'odnoklassniki'],
              percent: 50,
            },
          ],
          serviceKeys: [],
          percent: 0,
          bonusServiceKeys: [],
        },
      ],
    },
  };

  form = patchBasicServiceRows(form, {
    news: { price: '15000', discount: true, bonus: false },
    article: { price: '45000', discount: true, bonus: false },
    interview: { price: '60000', discount: true, bonus: true },
    specialProject: { price: '250000', discount: false, bonus: false },
    telegram: { price: '12000', discount: true, bonus: false },
    vk: { price: '10000', discount: true, bonus: false },
    odnoklassniki: { price: '9000', discount: true, bonus: false },
    max: { price: '9000', discount: true, bonus: false },
  });

  return patchSocialNetworks(form, {
    photo: true,
    video: true,
    platforms: {
      telegram: { reachOrSubscribers: '890 000', link: 'https://t.me/moscow24' },
      vk: { reachOrSubscribers: '1 200 000', link: 'https://vk.com/moscow24' },
      odnoklassniki: { reachOrSubscribers: '340 000', link: 'https://ok.ru/moscow24' },
      max: { reachOrSubscribers: '150 000', link: 'https://max.ru/moscow24' },
    },
  });
};

const createFederalPortalForm = (): AddMediaFormValues => {
  let form = cloneForm();

  form = {
    ...form,
    name: 'Федеральный аналитический портал',
    url: 'https://federal-analytics.ru',
    region: 'Санкт-Петербург',
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
  };

  form = patchBasicServiceRows(form, {
    news: { price: '12000', discount: true, bonus: true },
    article: { price: '35000', discount: true, bonus: true },
    interview: { price: '50000', discount: true, bonus: true },
    telegram: { price: '8000', discount: true, bonus: true },
    vk: { price: '7000', discount: true, bonus: true },
  });

  return patchSocialNetworks(form, {
    photo: true,
    video: true,
    platforms: {
      telegram: { reachOrSubscribers: '210 000', link: 'https://t.me/federal_analytics' },
      vk: { reachOrSubscribers: '180 000', link: 'https://vk.com/federal_analytics' },
    },
  });
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
