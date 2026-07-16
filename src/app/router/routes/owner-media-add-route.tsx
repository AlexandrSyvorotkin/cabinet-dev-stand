import { createRoute } from '@tanstack/react-router';
import { AddMediaPage } from '@/features/owner';
import { ownerLayoutRoute } from './owner-layout-route';

export const ownerMediaAddRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: 'media/new',
  component: AddMediaPage,
});
