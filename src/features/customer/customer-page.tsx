import { Badge, Button, Group, Stack, Tabs, Title } from '@mantine/core';
import { getCustomerOrdersCountByTab } from './mock/orders';
import { CUSTOMER_ORDER_TABS } from './model/order-tabs';
import { CustomerOrdersTable } from './ui/customer-orders-table';

const CustomerPage = () => {
  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Title order={2}>Личный кабинет заказчика</Title>
        <Button variant="light">Создать заказ</Button>
      </Group>

      <Tabs defaultValue="active">
        <Tabs.List>
          {CUSTOMER_ORDER_TABS.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              rightSection={
                <Badge size="sm" color={tab.badgeColor} variant="filled" circle>
                  {getCustomerOrdersCountByTab(tab.value)}
                </Badge>
              }
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {CUSTOMER_ORDER_TABS.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value} pt="md">
            <CustomerOrdersTable tab={tab.value} emptyText={tab.emptyText} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
};

export { CustomerPage };
