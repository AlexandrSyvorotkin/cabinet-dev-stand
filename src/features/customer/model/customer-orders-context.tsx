import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { MOCK_CUSTOMER_ORDERS } from '../mock/orders';
import {
  createCustomerOrderFromForm,
  updateCustomerOrderFromForm,
} from '../model/create-customer-order';
import type { CustomerOrder, CustomerOrderTabValue } from '../model/order';
import type { PlaceOrderFormValues } from '../model/place-order-form';
import { CUSTOMER_ORDER_TABS } from '../model/order-tabs';

type CustomerOrdersContextValue = {
  orders: CustomerOrder[];
  countsByTab: Record<CustomerOrderTabValue, number>;
  preferredTab: CustomerOrderTabValue | null;
  addOrder: (values: PlaceOrderFormValues) => CustomerOrder;
  updateOrder: (orderId: number, values: PlaceOrderFormValues) => CustomerOrder | null;
  getOrderById: (orderId: number) => CustomerOrder | undefined;
  clearPreferredTab: () => void;
  getOrdersByTab: (tab: CustomerOrderTabValue) => CustomerOrder[];
  getCompletedOrdersTotal: () => number;
};

const CustomerOrdersContext = createContext<CustomerOrdersContextValue | null>(null);

const getNextOrderId = (orders: CustomerOrder[]): number => {
  const maxId = orders.reduce((max, order) => Math.max(max, order.id), 0);
  return maxId + 1;
};

const CustomerOrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<CustomerOrder[]>(() =>
    structuredClone(MOCK_CUSTOMER_ORDERS),
  );
  const [preferredTab, setPreferredTab] = useState<CustomerOrderTabValue | null>(null);

  const countsByTab = useMemo(() => {
    return CUSTOMER_ORDER_TABS.reduce(
      (acc, tab) => {
        acc[tab.value] = orders.filter((order) => order.tab === tab.value).length;
        return acc;
      },
      {} as Record<CustomerOrderTabValue, number>,
    );
  }, [orders]);

  const getOrdersByTab = (tab: CustomerOrderTabValue): CustomerOrder[] =>
    orders.filter((order) => order.tab === tab);

  const getOrderById = (orderId: number): CustomerOrder | undefined =>
    orders.find((order) => order.id === orderId);

  const getCompletedOrdersTotal = (): number =>
    getOrdersByTab('completed').reduce((sum, order) => sum + order.depositedAmount, 0);

  const addOrder = (values: PlaceOrderFormValues): CustomerOrder => {
    const order = createCustomerOrderFromForm(values, getNextOrderId(orders));

    setOrders((current) => [order, ...current]);
    setPreferredTab('in-progress');

    return order;
  };

  const updateOrder = (
    orderId: number,
    values: PlaceOrderFormValues,
  ): CustomerOrder | null => {
    let updatedOrder: CustomerOrder | null = null;

    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        updatedOrder = updateCustomerOrderFromForm(order, values);
        return updatedOrder;
      }),
    );

    if (updatedOrder) {
      setPreferredTab('in-progress');
    }

    return updatedOrder;
  };

  const clearPreferredTab = () => {
    setPreferredTab(null);
  };

  const value = useMemo(
    () => ({
      orders,
      countsByTab,
      preferredTab,
      addOrder,
      updateOrder,
      getOrderById,
      clearPreferredTab,
      getOrdersByTab,
      getCompletedOrdersTotal,
    }),
    [orders, countsByTab, preferredTab],
  );

  return (
    <CustomerOrdersContext.Provider value={value}>
      {children}
    </CustomerOrdersContext.Provider>
  );
};

const useCustomerOrders = (): CustomerOrdersContextValue => {
  const context = useContext(CustomerOrdersContext);

  if (!context) {
    throw new Error('useCustomerOrders must be used within CustomerOrdersProvider');
  }

  return context;
};

export { CustomerOrdersProvider, useCustomerOrders };
