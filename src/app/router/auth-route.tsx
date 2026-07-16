import { createRoute, redirect } from '@tanstack/react-router';
import { AuthPage } from '@/features/auth';
import {
  getDefaultRouteForRole,
  getSession,
  isAuthenticated,
  ROUTES,
} from '@/shared/model';
import { rootRoute } from './root-route';

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.AUTH,
  component: AuthPage,
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
