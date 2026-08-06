import {
  ChartPie,
  ClipboardText,
  GearSix,
  Newspaper,
  Prohibit,
  Question,
  Users,
  type Icon,
} from '@phosphor-icons/react';
import { ROUTES, USER_ROLES, type UserRole } from '@/shared/model';

export type ModeratorNavItem = {
  label: string;
  to: string;
  icon: Icon;
  badge?: number;
  roles?: UserRole[];
};

export const MODERATOR_NAV_ITEMS: ModeratorNavItem[] = [
  {
    label: 'Обзор',
    to: ROUTES.MODERATOR,
    icon: ChartPie,
  },
  {
    label: 'СМИ',
    to: ROUTES.MODERATOR_MEDIA,
    icon: Newspaper,
    roles: [USER_ROLES.MAIN_MODERATOR],
  },
  {
    label: 'Заказы',
    to: ROUTES.MODERATOR_ORDERS,
    icon: ClipboardText,
  },
  {
    label: 'Пользователи',
    to: ROUTES.MODERATOR_USERS,
    icon: Users,
    roles: [USER_ROLES.MAIN_MODERATOR],
  },
  {
    label: 'Отклонённые',
    to: ROUTES.MODERATOR_REJECTED,
    icon: Prohibit,
    roles: [USER_ROLES.MAIN_MODERATOR],
  },
  {
    label: 'Настройки',
    to: ROUTES.MODERATOR_SETTINGS,
    icon: GearSix,
    roles: [USER_ROLES.MAIN_MODERATOR],
  },
  {
    label: 'Помощь',
    to: ROUTES.MODERATOR_HELP,
    icon: Question,
    roles: [USER_ROLES.MAIN_MODERATOR],
  },
];

export const getModeratorNavItems = (role: UserRole): ModeratorNavItem[] =>
  MODERATOR_NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
