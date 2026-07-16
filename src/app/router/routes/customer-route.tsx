import { createRoute } from '@tanstack/react-router';
import { CustomerPage } from '@/features/customer';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { ROUTES, USER_ROLES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const customerRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.CUSTOMER,
  component: CustomerPage,
  beforeLoad: createRoleGuard(USER_ROLES.CUSTOMER),
});
