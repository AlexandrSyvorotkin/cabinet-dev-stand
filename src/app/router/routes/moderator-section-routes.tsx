import { createRoute } from '@tanstack/react-router';
import { ModeratorPlaceholderPage } from '@/features/moderator';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { USER_ROLES } from '@/shared/model';
import { moderatorLayoutRoute } from './moderator-layout-route';

export const moderatorOrdersRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: 'orders',
  component: () => <ModeratorPlaceholderPage title="Заказы" />,
});

export const moderatorUsersRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: 'users',
  component: () => <ModeratorPlaceholderPage title="Пользователи" />,
  beforeLoad: createRoleGuard(USER_ROLES.MAIN_MODERATOR),
});

export const moderatorRejectedRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: 'rejected',
  component: () => <ModeratorPlaceholderPage title="Отклонённые" />,
  beforeLoad: createRoleGuard(USER_ROLES.MAIN_MODERATOR),
});

export const moderatorSettingsRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: 'settings',
  component: () => (
    <ModeratorPlaceholderPage
      title="Настройки"
      description="Раздел доступен только главному модератору"
    />
  ),
  beforeLoad: createRoleGuard(USER_ROLES.MAIN_MODERATOR),
});

export const moderatorHelpRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: 'help',
  component: () => <ModeratorPlaceholderPage title="Помощь" />,
  beforeLoad: createRoleGuard(USER_ROLES.MAIN_MODERATOR),
});
