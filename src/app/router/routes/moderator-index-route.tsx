import { createRoute } from '@tanstack/react-router';
import { ModeratorDashboardPage } from '@/features/moderator';
import { moderatorLayoutRoute } from './moderator-layout-route';

export const moderatorIndexRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: '/',
  component: ModeratorDashboardPage,
});
