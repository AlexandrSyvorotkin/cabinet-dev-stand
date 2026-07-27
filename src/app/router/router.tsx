import { createRouter } from '@tanstack/react-router';
import { appLayoutRoute } from './app-layout-route';
import { registerRoute } from './register-route';
import { authRoute } from './auth-route';
import { rootRoute } from './root-route';
import { appRoutes } from './routes';

const routeTree = rootRoute.addChildren([
  authRoute,
  registerRoute,
  appLayoutRoute.addChildren(appRoutes),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
