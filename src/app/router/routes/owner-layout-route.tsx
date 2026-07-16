import { createRoute } from '@tanstack/react-router';
import { OwnerLayout } from '@/features/owner';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { ROUTES, USER_ROLES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const ownerLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.OWNER,
  component: OwnerLayout,
  beforeLoad: createRoleGuard(USER_ROLES.OWNER),
});
