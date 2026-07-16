import {
  type AuthSession,
  type UserRole,
  USER_ROLES,
} from './roles';
import { ROUTES } from './routes';

const SESSION_KEY = 'authSession';

const loadSession = (): AuthSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

let sessionCache: AuthSession | null = loadSession();

const getSession = (): AuthSession | null => {
  return sessionCache;
};

const isAuthenticated = (): boolean => {
  return sessionCache !== null;
};

const saveAuthSession = (session: AuthSession): void => {
  sessionCache = session;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const logout = (): void => {
  sessionCache = null;
  localStorage.removeItem(SESSION_KEY);
};

const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case USER_ROLES.OWNER:
      return ROUTES.OWNER;
    case USER_ROLES.CUSTOMER:
      return ROUTES.CUSTOMER;
    case USER_ROLES.MODERATOR:
      return ROUTES.MODERATOR;
  }
};

export {
  getDefaultRouteForRole,
  getSession,
  isAuthenticated,
  logout,
  saveAuthSession,
};

export type { AuthSession };
