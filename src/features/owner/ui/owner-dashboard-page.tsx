import { Badge, Button, Group, Stack, Tabs } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { getOrdersCountByTab } from '../mock/orders';
import { OWNER_ORDER_TABS } from '../model/order-tabs';
import { OrdersTable } from './orders-table';
import { ROUTES } from '@/shared/model';

const OwnerDashboardPage = () => {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Tabs defaultValue="completed" style={{ flex: 1, minWidth: 280 }}>
          <Tabs.List>
            {OWNER_ORDER_TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                rightSection={
                  <Badge size="sm" color={tab.badgeColor} variant="filled" circle>
                    {getOrdersCountByTab(tab.value)}
                  </Badge>
                }
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {OWNER_ORDER_TABS.map((tab) => (
            <Tabs.Panel key={tab.value} value={tab.value} pt="md">
              <OrdersTable tab={tab.value} emptyText={tab.emptyText} />
            </Tabs.Panel>
          ))}
        </Tabs>

        <Button component={Link} to={ROUTES.OWNER_MEDIA}>
          Ваши СМИ
        </Button>
      </Group>
    </Stack>
  );
};

export { OwnerDashboardPage };
