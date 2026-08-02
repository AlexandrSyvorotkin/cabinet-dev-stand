import { createRoute } from '@tanstack/react-router';
import { MediaDetailPage } from '@/features/owner';
import { ownerLayoutRoute } from './owner-layout-route';

export const ownerMediaDetailRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: 'media/$mediaId',
  component: MediaDetailPage,
});
