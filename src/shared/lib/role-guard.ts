import { redirect } from '@tanstack/react-router';
import {
  getDefaultRouteForRole,
  getSession,
  ROUTES,
  type UserRole,
} from '@/shared/model';

const createRoleGuard = (allowedRoles: UserRole | UserRole[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return () => {
    const session = getSession();

    if (!session) {
      throw redirect({ to: ROUTES.AUTH });
    }

    if (!roles.includes(session.user.role)) {
      throw redirect({ to: getDefaultRouteForRole(session.user.role) });
    }
  };
};

export { createRoleGuard };
