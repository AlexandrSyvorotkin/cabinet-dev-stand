import { createRoute } from '@tanstack/react-router';
import { CustomerDashboardPage } from '@/features/customer';
import { customerLayoutRoute } from './customer-layout-route';

export const customerIndexRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/',
  component: CustomerDashboardPage,
});
