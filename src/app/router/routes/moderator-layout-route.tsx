import { createRoute } from '@tanstack/react-router';
import { ModeratorLayout } from '@/features/moderator';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { ROUTES, USER_ROLES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const moderatorLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.MODERATOR,
  component: ModeratorLayout,
  beforeLoad: createRoleGuard([USER_ROLES.MODERATOR, USER_ROLES.MAIN_MODERATOR]),
});
