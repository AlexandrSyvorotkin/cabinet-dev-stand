import type { ModerationStatus } from '../model/moderation-status';

export type ModeratorStats = {
  totalMedia: number;
  mediaTodayDelta: number;
  totalOrders: number;
  ordersTodayDelta: number;
  newUsers: number;
  rejectedToday: number;
};

export type ModeratorMediaRow = {
  id: string;
  name: string;
  url: string;
  region: string;
  status: ModerationStatus;
  registeredAt: string;
};

export type ModeratorNewUserActivity = {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
};

export type ModeratorPendingOrderActivity = {
  id: string;
  title: string;
  type: string;
  amount: number;
  createdAt: string;
};

export type ModeratorRejectedActivity = {
  id: string;
  title: string;
  reason: string;
  rejectedAt: string;
};

export const MODERATOR_STATS: ModeratorStats = {
  totalMedia: 124,
  mediaTodayDelta: 5,
  totalOrders: 87,
  ordersTodayDelta: 3,
  newUsers: 5,
  rejectedToday: 3,
};

export const MODERATOR_MEDIA_ROWS: ModeratorMediaRow[] = [
  {
    id: '1',
    name: 'Алтай-инфо',
    url: 'https://altai-info.ru',
    region: 'Республика Алтай',
    status: 'new',
    registeredAt: '15.03.2025',
  },
  {
    id: '2',
    name: 'Пермская газета',
    url: 'https://perm-gazeta.ru',
    region: 'Пермский край',
    status: 'moderation',
    registeredAt: '14.03.2025',
  },
  {
    id: '3',
    name: 'Москва 24',
    url: 'https://moscow24.ru',
    region: 'Москва',
    status: 'moderation',
    registeredAt: '13.03.2025',
  },
  {
    id: '4',
    name: 'Старые вести',
    url: 'https://old-news.ru',
    region: 'Санкт-Петербург',
    status: 'rejected',
    registeredAt: '12.03.2025',
  },
  {
    id: '5',
    name: 'Федеральный портал',
    url: 'https://fed-portal.ru',
    region: 'Федеральное',
    status: 'new',
    registeredAt: '11.03.2025',
  },
];

export const MODERATOR_NEW_USERS: ModeratorNewUserActivity[] = [
  {
    id: '1',
    name: 'Алексей Смирнов',
    email: 'alexey@media.ru',
    registeredAt: '15.03.2025',
  },
  {
    id: '2',
    name: 'Мария Иванова',
    email: 'maria@media.ru',
    registeredAt: '14.03.2025',
  },
  {
    id: '3',
    name: 'Дмитрий Козлов',
    email: 'dmitry@media.ru',
    registeredAt: '13.03.2025',
  },
];

export const MODERATOR_PENDING_ORDERS: ModeratorPendingOrderActivity[] = [
  {
    id: '1234',
    title: 'Заказ #1234',
    type: 'Ручное размещение',
    amount: 50_000,
    createdAt: '15.03.2025',
  },
  {
    id: '1235',
    title: 'Заказ #1235',
    type: 'Автоматическое размещение',
    amount: 25_000,
    createdAt: '14.03.2025',
  },
  {
    id: '1236',
    title: 'Заказ #1236',
    type: 'Ручное размещение',
    amount: 35_000,
    createdAt: '13.03.2025',
  },
];

export const MODERATOR_REJECTED_ITEMS: ModeratorRejectedActivity[] = [
  {
    id: '1',
    title: 'СМИ: Старые вести',
    reason: 'Не соответствует требованиям',
    rejectedAt: '12.03.2025',
  },
  {
    id: '2',
    title: 'Заказ #1230',
    reason: 'Некорректные данные',
    rejectedAt: '11.03.2025',
  },
];

export const MODERATOR_NAV_BADGES = {
  media: 12,
  orders: 8,
  users: 5,
  rejected: 3,
} as const;
