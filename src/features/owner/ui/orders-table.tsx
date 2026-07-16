import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { ExpandableList } from '@/shared/ui/expandable-list';
import { getCompletedOrdersTotal, getOrdersByTab } from '../mock/orders';
import type { OwnerOrder, OwnerOrderTabValue } from '../model/order';
import { OrderDetails } from './order-details';

type OrdersTableProps = {
  tab: OwnerOrderTabValue;
  emptyText: string;
};

const formatAmount = (value: number): string => {
  return value.toLocaleString('ru-RU');
};

const OrdersTable = ({ tab, emptyText }: OrdersTableProps) => {
  const orders = getOrdersByTab(tab);
  const showPeriodTotal = tab === 'completed';

  return (
    <Stack gap="md">
      <Group align="flex-end" wrap="wrap">
        <Group align="flex-end" gap="xs">
          <Text size="sm" fw={500}>
            С
          </Text>
          <TextInput defaultValue="18.07.2018" w={140} />
          <Text size="sm" fw={500}>
            по
          </Text>
          <TextInput defaultValue="24.05.2025" w={140} />
          <Button>Показать</Button>
        </Group>

        {showPeriodTotal ? (
          <Text size="sm" fw={500} ml="auto">
            Итого за период: {formatAmount(getCompletedOrdersTotal())} руб.
          </Text>
        ) : null}
      </Group>

      <ExpandableList
        items={orders}
        emptyText={emptyText}
        renderControl={(order: OwnerOrder) => (
          <Group justify="space-between" wrap="nowrap" gap="md">
            <Text fw={600} tt="uppercase" size="sm">
              #{order.id} | {order.title}
            </Text>
            <Text size="sm" c="dimmed">
              {order.statusLabel}
            </Text>
          </Group>
        )}
        renderPanel={(order: OwnerOrder) => <OrderDetails order={order} />}
        renderSummary={
          tab === 'completed'
            ? (order: OwnerOrder) =>
                order.mediaCount && order.amount && order.completedAt ? (
                  <Text size="sm" c="dimmed">
                    {order.mediaCount} СМИ | {formatAmount(order.amount)} руб. из{' '}
                    {formatAmount(order.completedAmount ?? order.amount)} руб. выполнено{' '}
                    {order.completedAt}
                  </Text>
                ) : null
            : undefined
        }
      />
    </Stack>
  );
};

export { OrdersTable };
