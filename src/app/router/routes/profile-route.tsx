import { createRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/features/profile';
import { ROUTES } from '@/shared/model';
import { appLayoutRoute } from '../app-layout-route';

export const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: ROUTES.PROFILE,
  component: ProfilePage,
});
