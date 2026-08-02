import { homeRoute } from './home-route';
import { moderatorRoute } from './moderator-route';
import { ownerIndexRoute } from './owner-index-route';
import { ownerLayoutRoute } from './owner-layout-route';
import { ownerMediaAddRoute } from './owner-media-add-route';
import { ownerMediaDetailRoute } from './owner-media-detail-route';
import { ownerMediaEditRoute } from './owner-media-edit-route';
import { ownerMediaRoute } from './owner-media-route';
import { profileRoute } from './profile-route';

export const appRoutes = [
  homeRoute,
  ownerLayoutRoute.addChildren([
    ownerIndexRoute,
    ownerMediaRoute,
    ownerMediaAddRoute,
    ownerMediaDetailRoute,
    ownerMediaEditRoute,
  ]),
  moderatorRoute,
  profileRoute,
];

export {
  homeRoute,
  moderatorRoute,
  ownerIndexRoute,
  ownerLayoutRoute,
  ownerMediaAddRoute,
  ownerMediaDetailRoute,
  ownerMediaEditRoute,
  ownerMediaRoute,
  profileRoute,
};
