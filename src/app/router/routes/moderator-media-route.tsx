import { createRoute } from '@tanstack/react-router';
import { ModeratorPlaceholderPage } from '@/features/moderator';
import { createRoleGuard } from '@/shared/lib/role-guard';
import { USER_ROLES } from '@/shared/model';
import { moderatorLayoutRoute } from './moderator-layout-route';

export const moderatorMediaRoute = createRoute({
  getParentRoute: () => moderatorLayoutRoute,
  path: 'media',
  component: () => <ModeratorPlaceholderPage title="СМИ" />,
  beforeLoad: createRoleGuard(USER_ROLES.MAIN_MODERATOR),
});
