import type { CustomerOrder } from '../model/order';
import { CUSTOMER_TAB_COUNTS } from '../model/order';

const createCompletedOrder = (
  order: Omit<CustomerOrder, 'tab'>,
): CustomerOrder => ({
  ...order,
  tab: 'completed',
});

const MOCK_CUSTOMER_ORDERS: CustomerOrder[] = [
  createCompletedOrder({
    id: 5271,
    title: 'Ручное размещение СМИ',
    statusLabel: 'отклонено исполнителем',
    newsUrl:
      'https://mkset.ru/news/2025/05/24/v-perm-kraj-prishla-vesna-i-letnie-lagerya-dlya-detey.html',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    completedCount: 0,
    totalCount: 1,
    time: '19:58',
    date: '10.07.2026',
    placedMedia: [
      {
        id: '5271-media-1',
        mediaName: 'Тема Уфа — новости Республики Башкортостан',
        statusLabel: 'отклонено исполнителем',
        showGoogleIcon: true,
      },
    ],
    depositedAmount: 20_000,
    returnedAmount: 20_000,
    deductedAmount: 0,
  }),
  createCompletedOrder({
    id: 4663,
    title: 'Ручное размещение СМИ',
    statusLabel: 'выполнено',
    newsUrl: 'https://example.com/news/4663-regional-campaign',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    completedCount: 7,
    totalCount: 8,
    time: '18:25',
    date: '11.12.2023',
    placedMedia: [
      {
        id: '4663-media-1',
        mediaName: 'Пермская газета',
        statusLabel: 'выполнено',
      },
      {
        id: '4663-media-2',
        mediaName: 'Москва 24',
        statusLabel: 'выполнено',
      },
    ],
    depositedAmount: 160_000,
    returnedAmount: 20_000,
    deductedAmount: 140_000,
  }),
  createCompletedOrder({
    id: 4588,
    title: 'Ручное размещение СМИ',
    statusLabel: 'выполнено',
    newsUrl: 'https://example.com/news/4588-winter-program',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Средний',
    hasSourceLink: true,
    hasAdSignature: true,
    canFullReprint: false,
    placementType: 'PR-волна',
    completedCount: 3,
    totalCount: 5,
    time: '14:10',
    date: '02.09.2024',
    placedMedia: [
      {
        id: '4588-media-1',
        mediaName: 'Алтай Инфо',
        statusLabel: 'выполнено',
      },
    ],
    depositedAmount: 100_000,
    returnedAmount: 40_000,
    deductedAmount: 60_000,
  }),
  createCompletedOrder({
    id: 4512,
    title: 'Ручное размещение СМИ',
    statusLabel: 'выполнено',
    newsUrl: 'https://example.com/news/4512-spring-release',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: false,
    hasAdSignature: false,
    canFullReprint: true,
    placementType: 'PR-волна',
    completedCount: 2,
    totalCount: 2,
    time: '09:45',
    date: '21.03.2024',
    placedMedia: [
      {
        id: '4512-media-1',
        mediaName: 'РБК',
        statusLabel: 'выполнено',
      },
    ],
    depositedAmount: 50_000,
    returnedAmount: 0,
    deductedAmount: 50_000,
  }),
  createCompletedOrder({
    id: 4420,
    title: 'Ручное размещение СМИ',
    statusLabel: 'отклонено по дедлайну',
    newsUrl: 'https://example.com/news/4420-industry-report',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    completedCount: 1,
    totalCount: 3,
    time: '16:30',
    date: '05.01.2024',
    placedMedia: [
      {
        id: '4420-media-1',
        mediaName: 'Комсомольская правда',
        statusLabel: 'отклонено по дедлайну',
      },
    ],
    depositedAmount: 60_000,
    returnedAmount: 40_000,
    deductedAmount: 20_000,
  }),
];

const getCustomerOrdersByTab = (tab: CustomerOrder['tab']): CustomerOrder[] =>
  MOCK_CUSTOMER_ORDERS.filter((order) => order.tab === tab);

const getCustomerOrdersCountByTab = (tab: CustomerOrder['tab']): number =>
  CUSTOMER_TAB_COUNTS[tab];

const getCompletedCustomerOrdersTotal = (): number =>
  getCustomerOrdersByTab('completed').reduce(
    (sum, order) => sum + order.depositedAmount,
    0,
  );

export {
  getCompletedCustomerOrdersTotal,
  getCustomerOrdersByTab,
  getCustomerOrdersCountByTab,
  MOCK_CUSTOMER_ORDERS,
};
