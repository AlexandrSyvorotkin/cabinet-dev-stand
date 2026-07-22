import { createRoute } from '@tanstack/react-router';
import { PlaceOrderPage } from '@/features/customer';
import { customerLayoutRoute } from './customer-layout-route';

export const customerOrderNewRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: 'orders/new',
  component: PlaceOrderPage,
});
