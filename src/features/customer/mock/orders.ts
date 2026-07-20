import type { CustomerOrder } from '../model/order';

const MOCK_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 8401,
    title: 'Размещение PR-материала',
    statusLabel: 'в работе',
    tab: 'active',
    sourceLink:
      'https://example.com/materials/summer-campaign-2025.docx',
    sourceDocumentName: 'summer-campaign-2025.docx',
    hasImages: true,
    description:
      'Материал о запуске летних программ для детей в регионе. Нужно разместить в региональных СМИ с акцентом на социальную значимость.',
    placementType: 'Новость',
    characterCount: 1500,
    priceAmount: 28_000,
    isAdvertising: true,
    needsEridRegistration: true,
    eridToken: '2Vtzq8KpR9',
    regionNote: 'Регион за Уралом (+4, +5)',
    placementHours: 24,
    headlines: 'По смыслу или как в первоисточнике',
    rewriteLevel: 'light',
    rewritePercent: 15,
    comment: 'Просим согласовать заголовок до публикации.',
    mediaPlacements: [
      {
        id: 'media-1',
        mediaName: 'Пермская газета',
        status: 'accepted',
        hasDocument: true,
        hasDescription: true,
        rewriteRequired: true,
        advertisingRequired: true,
        eridMarking: true,
      },
      {
        id: 'media-2',
        mediaName: 'Москва 24',
        status: 'pending',
        hasDocument: true,
        hasDescription: true,
        rewriteRequired: false,
        advertisingRequired: true,
        eridMarking: true,
      },
      {
        id: 'media-3',
        mediaName: 'Алтай Инфо',
        status: 'refused',
        refusalReason: 'topic-mismatch',
        hasDocument: true,
        hasDescription: false,
        rewriteRequired: true,
        advertisingRequired: false,
        eridMarking: false,
      },
    ],
    messages: [
      {
        id: 'msg-1',
        author: 'moderator',
        text: 'Проверьте ERID-токен для рекламного материала.',
        createdAt: '20.07.2026, 10:15',
      },
      {
        id: 'msg-2',
        author: 'customer',
        text: 'Токен обновлён, приложил в описании заказа.',
        createdAt: '20.07.2026, 11:40',
      },
    ],
    mediaCount: 3,
    amount: 28_000,
  },
  {
    id: 8312,
    title: 'Статья для федерального СМИ',
    statusLabel: 'на модерации',
    tab: 'active',
    sourceLink: 'https://docs.example.com/article-draft',
    hasImages: false,
    description: 'Лонгрид об отрасли, нужен сильный рерайт под редакционные стандарты.',
    placementType: 'Статья',
    characterCount: 5000,
    priceAmount: 75_000,
    isAdvertising: false,
    needsEridRegistration: false,
    placementHours: 48,
    headlines: 'До 100 знаков, без кликбейта',
    rewriteLevel: 'strong',
    rewritePercent: 40,
    comment: '',
    mediaPlacements: [
      {
        id: 'media-4',
        mediaName: 'РБК',
        status: 'pending',
        hasDocument: true,
        hasDescription: true,
        rewriteRequired: true,
        advertisingRequired: false,
        eridMarking: false,
      },
    ],
    messages: [],
    mediaCount: 1,
    amount: 75_000,
  },
  {
    id: 8190,
    title: 'Интервью с экспертом',
    statusLabel: 'выполнено',
    tab: 'completed',
    sourceLink: 'https://example.com/interview-transcript.pdf',
    sourceDocumentName: 'interview-transcript.pdf',
    hasImages: true,
    description: 'Интервью с экспертом отрасли, публикация в региональном медиа.',
    placementType: 'Интервью',
    characterCount: 5000,
    priceAmount: 42_000,
    isAdvertising: false,
    needsEridRegistration: false,
    placementHours: 72,
    headlines: 'Интервью: [имя эксперта]',
    rewriteLevel: 'light',
    rewritePercent: 10,
    comment: 'Спасибо, всё опубликовано в срок.',
    resultLink: 'https://perm-gazeta.ru/news/interview-expert-2025',
    mediaPlacements: [
      {
        id: 'media-5',
        mediaName: 'Пермская газета',
        status: 'accepted',
        hasDocument: true,
        hasDescription: true,
        rewriteRequired: true,
        advertisingRequired: false,
        eridMarking: false,
      },
    ],
    messages: [
      {
        id: 'msg-3',
        author: 'moderator',
        text: 'Размещение выполнено, ссылка добавлена в заказ.',
        createdAt: '15.07.2026, 16:20',
      },
    ],
    mediaCount: 1,
    amount: 42_000,
    completedAt: '15.07.2026',
  },
];

const getCustomerOrdersByTab = (tab: CustomerOrder['tab']): CustomerOrder[] =>
  MOCK_CUSTOMER_ORDERS.filter((order) => order.tab === tab);

const getCustomerOrdersCountByTab = (tab: CustomerOrder['tab']): number =>
  getCustomerOrdersByTab(tab).length;

const getCompletedCustomerOrdersTotal = (): number =>
  getCustomerOrdersByTab('completed').reduce(
    (sum, order) => sum + (order.amount ?? 0),
    0,
  );

export {
  getCompletedCustomerOrdersTotal,
  getCustomerOrdersByTab,
  getCustomerOrdersCountByTab,
  MOCK_CUSTOMER_ORDERS,
};
