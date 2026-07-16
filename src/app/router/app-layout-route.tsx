import { createRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from './app-layout';
import { rootRoute } from './root-route';
import { isAuthenticated } from '@/shared/model/session';
import { ROUTES } from '@/shared/model';

export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: ROUTES.AUTH });
    }
  },
});
