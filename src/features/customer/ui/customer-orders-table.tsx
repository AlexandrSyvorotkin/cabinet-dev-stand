import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { ExpandableList } from '@/shared/ui/expandable-list';
import {
  getCompletedCustomerOrdersTotal,
  getCustomerOrdersByTab,
} from '../mock/orders';
import type { CustomerOrder, CustomerOrderTabValue } from '../model/order';
import { CustomerOrderDetails } from './customer-order-details';

type CustomerOrdersTableProps = {
  tab: CustomerOrderTabValue;
  emptyText: string;
};

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const CustomerOrdersTable = ({ tab, emptyText }: CustomerOrdersTableProps) => {
  const orders = getCustomerOrdersByTab(tab);
  const showPeriodTotal = tab === 'completed';

  return (
    <Stack gap="md">
      <Group align="flex-end" wrap="wrap">
        <Group align="flex-end" gap="xs">
          <Text size="sm" fw={500}>
            С
          </Text>
          <TextInput defaultValue="01.07.2026" w={140} />
          <Text size="sm" fw={500}>
            по
          </Text>
          <TextInput defaultValue="20.07.2026" w={140} />
          <Button>Показать</Button>
        </Group>

        {showPeriodTotal ? (
          <Text size="sm" fw={500} ml="auto">
            Итого за период: {formatAmount(getCompletedCustomerOrdersTotal())} руб.
          </Text>
        ) : null}
      </Group>

      <ExpandableList
        items={orders}
        emptyText={emptyText}
        renderControl={(order: CustomerOrder) => (
          <Group justify="space-between" wrap="nowrap" gap="md">
            <Text fw={600} tt="uppercase" size="sm">
              #{order.id} | {order.title}
            </Text>
            <Text size="sm" c="dimmed">
              {order.statusLabel}
            </Text>
          </Group>
        )}
        renderPanel={(order: CustomerOrder) => <CustomerOrderDetails order={order} />}
        renderSummary={
          tab === 'completed'
            ? (order: CustomerOrder) => (
                <Text size="sm" c="dimmed">
                  {order.totalCount} СМИ | {formatAmount(order.depositedAmount)} руб. из{' '}
                  {formatAmount(order.deductedAmount)} руб. выполнено {order.date}
                </Text>
              )
            : undefined
        }
      />
    </Stack>
  );
};

export { CustomerOrdersTable };
