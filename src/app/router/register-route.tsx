import { createRoute, redirect } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth';
import {
  getDefaultRouteForRole,
  getSession,
  isAuthenticated,
  ROUTES,
} from '@/shared/model';
import { rootRoute } from './root-route';

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.AUTH_REGISTER,
  component: RegisterPage,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      return;
    }

    const session = getSession();

    if (session) {
      throw redirect({ to: getDefaultRouteForRole(session.user.role) });
    }
  },
});
