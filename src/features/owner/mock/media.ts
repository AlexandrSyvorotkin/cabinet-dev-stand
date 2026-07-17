import {
  createEmptyBasicServices,
  type BasicServicesState,
  type BasicServiceRowValues,
} from '../model/basic-services';
import {
  createEmptyPricingRules,
  type PricingRules,
  type ServicePackage,
} from '../model/pricing';
import { EMPTY_ADD_MEDIA_FORM, type AddMediaFormValues } from '../model/add-media-form';
import type { OwnerMediaItem } from '../model/media';

const cloneFormValues = (values: AddMediaFormValues): AddMediaFormValues =>
  structuredClone(values);

const patchBasicServices = (
  basicServices: BasicServicesState,
  patches: Record<string, Partial<BasicServiceRowValues>>,
): BasicServicesState => {
  const values = { ...basicServices.values };

  for (const [id, patch] of Object.entries(patches)) {
    if (values[id]) {
      values[id] = { ...values[id], ...patch };
    }
  }

  return { ...basicServices, values };
};

const createMockPricingRules = (
  servicePackages: ServicePackage[],
  extras?: Partial<Omit<PricingRules, 'servicePackages'>>,
): PricingRules => ({
  ...createEmptyPricingRules(),
  ...extras,
  servicePackages,
});

const createMockActiveMedia = (
  id: number,
  overrides: Partial<AddMediaFormValues> & Pick<AddMediaFormValues, 'name' | 'url'>,
): OwnerMediaItem => ({
  id,
  tab: 'active',
  statusLabel: 'Активно',
  data: {
    ...cloneFormValues(EMPTY_ADD_MEDIA_FORM),
    ...overrides,
  },
});

const MOCK_ACTIVE_MEDIA: OwnerMediaItem[] = [
  createMockActiveMedia(1001, {
    name: 'MKset.ru',
    url: 'https://mkset.ru',
    region: 'Пермский край',
    coverage: 'Региональное',
    trafficReach: '120 000',
    yandexSearch: true,
    googleSearch: true,
    hasErid: true,
    eridToken: '2VtzqwXXXX',
    reportsEnabled: true,
    validityPeriod: '12 месяцев',
    basicServices: patchBasicServices(createEmptyBasicServices(), {
      article: { discount: true },
      interview: { discount: true },
      telegram: { discount: true, bonus: true },
    }),
    pricingRules: createMockPricingRules(
      [
        {
          id: 'pkg-mkset-discount',
          name: 'Комбо размещение',
          kind: 'discount',
          minCount: 2,
          baseServiceKeys: ['news'],
          serviceKeys: ['article', 'interview'],
          percent: 15,
          bonusServiceKeys: [],
        },
        {
          id: 'pkg-mkset-bonus',
          name: 'Соцсети в подарок',
          kind: 'bonus',
          minCount: 2,
          baseServiceKeys: [],
          serviceKeys: ['news', 'article'],
          percent: 0,
          bonusServiceKeys: ['telegram'],
        },
      ],
      {
        agencyDiscount: { enabled: true, percent: 10 },
        addons: [
          {
            id: 'addon-mkset-erid',
            name: 'Оформление ERID',
            price: '1500',
            enabled: true,
          },
        ],
      },
    ),
  }),
  createMockActiveMedia(1002, {
    name: '59.ru',
    url: 'https://59.ru',
    region: 'Пермский край',
    coverage: 'Региональное',
    trafficReach: '85 000',
    yandexSearch: true,
    googleSearch: false,
    hasErid: true,
    eridToken: '2VtzqwYYYY',
    reportsEnabled: false,
    validityPeriod: '6 месяцев',
    basicServices: patchBasicServices(createEmptyBasicServices(), {
      article: { discount: true },
      telegram: { discount: true },
      vk: { discount: true },
    }),
    pricingRules: createMockPricingRules([
      {
        id: 'pkg-59-discount',
        name: 'PR-волна',
        kind: 'discount',
        minCount: 2,
        baseServiceKeys: ['news'],
        serviceKeys: ['article', 'telegram', 'vk'],
        percent: 10,
        bonusServiceKeys: [],
      },
    ]),
  }),
  createMockActiveMedia(1003, {
    name: 'Коммерсантъ',
    url: 'https://kommersant.ru',
    region: 'Москва',
    coverage: 'Федеральное',
    trafficReach: '2 500 000',
    yandexSearch: true,
    googleSearch: true,
    hasErid: true,
    eridToken: '2VtzqwZZZZ',
    reportsEnabled: true,
    validityPeriod: '12 месяцев',
    basicServices: patchBasicServices(createEmptyBasicServices(), {
      interview: { discount: true },
      specialProject: { discount: true },
      telegram: { bonus: true },
      vk: { bonus: true },
    }),
    pricingRules: createMockPricingRules(
      [
        {
          id: 'pkg-kommersant-discount',
          name: 'Федеральный пакет',
          kind: 'discount',
          minCount: 2,
          baseServiceKeys: ['article'],
          serviceKeys: ['interview', 'specialProject'],
          percent: 20,
          bonusServiceKeys: [],
        },
        {
          id: 'pkg-kommersant-bonus',
          name: 'Мультиканал',
          kind: 'bonus',
          minCount: 2,
          baseServiceKeys: [],
          serviceKeys: ['article', 'interview'],
          percent: 0,
          bonusServiceKeys: ['telegram', 'vk'],
        },
      ],
      {
        agencyDiscount: { enabled: true, percent: 15 },
      },
    ),
  }),
];

export { MOCK_ACTIVE_MEDIA };
