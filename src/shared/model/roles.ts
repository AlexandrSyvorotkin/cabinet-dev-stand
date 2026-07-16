export const USER_ROLES = {
  OWNER: 'owner',
  CUSTOMER: 'customer',
  MODERATOR: 'moderator',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Владелец СМИ',
  customer: 'Заказчик',
  moderator: 'Модератор',
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};
