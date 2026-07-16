import { createRoute } from '@tanstack/react-router';
import { ModeratorPage } from '@/features/moderator';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { ROUTES, USER_ROLES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const moderatorRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.MODERATOR,
  component: ModeratorPage,
  beforeLoad: createRoleGuard(USER_ROLES.MODERATOR),
});
