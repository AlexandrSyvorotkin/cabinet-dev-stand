import { createRoute } from '@tanstack/react-router';
import { OwnerDashboardPage } from '@/features/owner';
import { ownerLayoutRoute } from './owner-layout-route';

export const ownerIndexRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: '/',
  component: OwnerDashboardPage,
});
