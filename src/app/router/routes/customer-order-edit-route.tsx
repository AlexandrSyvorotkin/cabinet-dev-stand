import { createRoute } from '@tanstack/react-router';
import { EditOrderPage } from '@/features/customer';
import { customerLayoutRoute } from './customer-layout-route';

export const customerOrderEditRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: 'orders/$orderId/edit',
  component: EditOrderPage,
});
