import { Badge, Button, Group, Stack, Tabs } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/shared/model';
import { useCustomerOrders } from '../model/customer-orders-context';
import type { CustomerOrderTabValue } from '../model/order';
import { CUSTOMER_ORDER_TABS } from '../model/order-tabs';
import { CustomerOrdersTable } from './customer-orders-table';

const CustomerDashboardPage = () => {
  const { countsByTab, preferredTab, clearPreferredTab } = useCustomerOrders();
  const [activeTab, setActiveTab] = useState<CustomerOrderTabValue>('completed');

  useEffect(() => {
    if (!preferredTab) {
      return;
    }

    setActiveTab(preferredTab);
    clearPreferredTab();
  }, [preferredTab, clearPreferredTab]);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab((value as CustomerOrderTabValue) ?? 'completed')}
          style={{ flex: 1, minWidth: 280 }}
        >
          <Tabs.List>
            {CUSTOMER_ORDER_TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                rightSection={
                  <Badge size="sm" color={tab.badgeColor} variant="filled" circle>
                    {countsByTab[tab.value]}
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

        <Button component={Link} to={ROUTES.CUSTOMER_ORDER_NEW}>
          Разместить заказ
        </Button>
      </Group>
    </Stack>
  );
};

export { CustomerDashboardPage };
