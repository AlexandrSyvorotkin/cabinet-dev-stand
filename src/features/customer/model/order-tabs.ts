import type { CustomerOrderTabValue } from './order';

export const CUSTOMER_ORDER_TABS: {
  value: CustomerOrderTabValue;
  label: string;
  badgeColor: string;
  emptyText: string;
}[] = [
  {
    value: 'active',
    label: 'Активные',
    badgeColor: 'blue',
    emptyText: 'Активные заказы появятся здесь.',
  },
  {
    value: 'completed',
    label: 'Завершённые',
    badgeColor: 'green',
    emptyText: 'Завершённые заказы появятся здесь.',
  },
];
