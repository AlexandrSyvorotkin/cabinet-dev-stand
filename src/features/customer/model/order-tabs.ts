import type { CustomerOrderTabValue } from './order';

export const CUSTOMER_ORDER_TABS: {
  value: CustomerOrderTabValue;
  label: string;
  badgeColor: string;
  emptyText: string;
}[] = [
  {
    value: 'in-progress',
    label: 'В работе',
    badgeColor: 'gray',
    emptyText: 'В настоящее время нет действующих заказов.',
  },
  {
    value: 'special',
    label: 'Специальные заказы',
    badgeColor: 'gray',
    emptyText: 'Специальных заказов пока нет.',
  },
  {
    value: 'completed',
    label: 'Выполнено',
    badgeColor: 'green',
    emptyText: 'Выполненные заказы появятся здесь.',
  },
  {
    value: 'saved',
    label: 'Сохранённые заказы',
    badgeColor: 'gray',
    emptyText: 'Сохранённых заказов пока нет.',
  },
];
