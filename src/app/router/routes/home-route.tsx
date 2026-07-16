import { createRoute, redirect } from '@tanstack/react-router';
import { getDefaultRouteForRole, getSession, ROUTES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.HOME,
  beforeLoad: () => {
    const session = getSession();

    if (!session) {
      throw redirect({ to: ROUTES.AUTH });
    }

    throw redirect({ to: getDefaultRouteForRole(session.user.role) });
  },
});
