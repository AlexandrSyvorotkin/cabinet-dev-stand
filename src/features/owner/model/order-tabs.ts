import type { OwnerOrderTabValue } from './order';

export const OWNER_ORDER_TABS: {
  value: OwnerOrderTabValue;
  label: string;
  badgeColor: string;
  emptyText: string;
}[] = [
  {
    value: 'pool',
    label: 'Пул работ',
    badgeColor: 'gray',
    emptyText:
      'Если для Вас будет предложение — вы его сможете увидеть в этом разделе.',
  },
  {
    value: 'in-progress',
    label: 'В работе',
    badgeColor: 'gray',
    emptyText: 'Заказы в работе появятся здесь.',
  },
  {
    value: 'moderation',
    label: 'На модерации',
    badgeColor: 'red',
    emptyText: 'Заказы на модерации появятся здесь.',
  },
  {
    value: 'completed',
    label: 'Выполнено',
    badgeColor: 'green',
    emptyText: 'Выполненные заказы появятся здесь.',
  },
];
