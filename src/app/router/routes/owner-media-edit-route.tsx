import { createRoute } from '@tanstack/react-router';
import { EditMediaPage } from '@/features/owner';
import { ownerLayoutRoute } from './owner-layout-route';

export const ownerMediaEditRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: 'media/$mediaId/edit',
  component: EditMediaPage,
});
