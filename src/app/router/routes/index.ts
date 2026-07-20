import { customerIndexRoute } from './customer-index-route';
import { customerLayoutRoute } from './customer-layout-route';
import { homeRoute } from './home-route';
import { moderatorRoute } from './moderator-route';
import { ownerIndexRoute } from './owner-index-route';
import { ownerLayoutRoute } from './owner-layout-route';
import { ownerMediaAddRoute } from './owner-media-add-route';
import { ownerMediaEditRoute } from './owner-media-edit-route';
import { ownerMediaRoute } from './owner-media-route';
import { profileRoute } from './profile-route';

export const appRoutes = [
  homeRoute,
  ownerLayoutRoute.addChildren([
    ownerIndexRoute,
    ownerMediaRoute,
    ownerMediaAddRoute,
    ownerMediaEditRoute,
  ]),
  customerLayoutRoute.addChildren([customerIndexRoute]),
  moderatorRoute,
  profileRoute,
];

export {
  customerIndexRoute,
  customerLayoutRoute,
  homeRoute,
  moderatorRoute,
  ownerIndexRoute,
  ownerLayoutRoute,
  ownerMediaAddRoute,
  ownerMediaEditRoute,
  ownerMediaRoute,
  profileRoute,
};
