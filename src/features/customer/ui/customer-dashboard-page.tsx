import { Badge, Button, Group, Stack, Tabs } from '@mantine/core';
import { getCustomerOrdersCountByTab } from '../mock/orders';
import { CUSTOMER_ORDER_TABS } from '../model/order-tabs';
import { CustomerOrdersTable } from './customer-orders-table';

const CustomerDashboardPage = () => {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Tabs defaultValue="completed" style={{ flex: 1, minWidth: 280 }}>
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

        <Button>Разместить заказ</Button>
      </Group>
    </Stack>
  );
};

export { CustomerDashboardPage };
