import { createRoute } from '@tanstack/react-router';
import { CustomerLayout } from '@/features/customer';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { ROUTES, USER_ROLES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const customerLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.CUSTOMER,
  component: CustomerLayout,
  beforeLoad: createRoleGuard(USER_ROLES.CUSTOMER),
});
