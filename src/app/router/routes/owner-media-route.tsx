import { createRoute } from '@tanstack/react-router';
import { OwnerMediaPage } from '@/features/owner';
import { ownerLayoutRoute } from './owner-layout-route';

export const ownerMediaRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: 'media',
  component: OwnerMediaPage,
});
