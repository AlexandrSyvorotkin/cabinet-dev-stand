import type { OwnerOrder } from '../model/order';

const MOCK_ORDERS: OwnerOrder[] = [
  {
    id: 5271,
    title: 'Ручное размещение СМИ',
    statusLabel: 'отклонено исполнителем',
    tab: 'completed',
    newsUrl:
      'https://mkset.ru/news/2025/05/24/v-perm-kraj-prishla-vesna-i-letnie-lagerya-dlya-detey.html',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    mediaCount: 1,
    amount: 20_000,
    completedAmount: 20_000,
    completedAt: '24.05.2025',
  },
  {
    id: 5155,
    title: 'Ручное размещение СМИ',
    statusLabel: 'отклонено исполнителем',
    tab: 'completed',
    newsUrl:
      'https://example.com/news/5155-perm-region-summer-camps-for-children',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    mediaCount: 1,
    amount: 20_000,
    completedAmount: 20_000,
    completedAt: '24.05.2025',
  },
  {
    id: 5154,
    title: 'Ручное размещение СМИ',
    statusLabel: 'отклонено по дедлайну',
    tab: 'completed',
    newsUrl: 'https://example.com/news/5154-media-placement-deadline',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    mediaCount: 1,
    amount: 20_000,
    completedAmount: 20_000,
    completedAt: '24.05.2025',
  },
  {
    id: 5153,
    title: 'Ручное размещение СМИ',
    statusLabel: 'отклонено по дедлайну',
    tab: 'completed',
    newsUrl: 'https://example.com/news/5153-media-campaign',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
    mediaCount: 1,
    amount: 20_000,
    completedAmount: 20_000,
    completedAt: '24.05.2025',
  },
  {
    id: 5012,
    title: 'Ручное размещение СМИ',
    statusLabel: 'выполнено',
    tab: 'completed',
    newsUrl: 'https://example.com/news/5012-successful-placement',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: true,
    placementType: 'PR-волна',
    mediaCount: 2,
    amount: 35_000,
    completedAmount: 35_000,
    completedAt: '18.05.2025',
  },
  {
    id: 4890,
    title: 'Ручное размещение СМИ',
    statusLabel: 'на модерации',
    tab: 'moderation',
    newsUrl: 'https://example.com/news/4890-pending-review',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Средний',
    hasSourceLink: true,
    hasAdSignature: true,
    canFullReprint: false,
    placementType: 'PR-волна',
  },
  {
    id: 4721,
    title: 'Ручное размещение СМИ',
    statusLabel: 'в работе',
    tab: 'in-progress',
    newsUrl: 'https://example.com/news/4721-in-progress',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: false,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
  },
  {
    id: 4601,
    title: 'Ручное размещение СМИ',
    statusLabel: 'новое предложение',
    tab: 'pool',
    newsUrl: 'https://example.com/news/4601-new-offer',
    keywords: 'По смыслу или как в первоисточнике',
    rewriteType: 'Легкий',
    hasSourceLink: true,
    hasAdSignature: false,
    canFullReprint: false,
    placementType: 'PR-волна',
  },
];

const getOrdersByTab = (tab: OwnerOrder['tab']): OwnerOrder[] => {
  return MOCK_ORDERS.filter((order) => order.tab === tab);
};

const getOrdersCountByTab = (tab: OwnerOrder['tab']): number => {
  return getOrdersByTab(tab).length;
};

const getCompletedOrdersTotal = (): number => {
  return getOrdersByTab('completed').reduce(
    (sum, order) => sum + (order.completedAmount ?? 0),
    0,
  );
};

export {
  getCompletedOrdersTotal,
  getOrdersByTab,
  getOrdersCountByTab,
  MOCK_ORDERS,
};
