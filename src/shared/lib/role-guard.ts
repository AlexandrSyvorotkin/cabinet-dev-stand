import { redirect } from '@tanstack/react-router';
import {
  getDefaultRouteForRole,
  getSession,
  ROUTES,
  type UserRole,
} from '@/shared/model';

const createRoleGuard = (allowedRole: UserRole) => {
  return () => {
    const session = getSession();

    if (!session) {
      throw redirect({ to: ROUTES.AUTH });
    }

    if (session.user.role !== allowedRole) {
      throw redirect({ to: getDefaultRouteForRole(session.user.role) });
    }
  };
};

export { createRoleGuard };
