import { customerRoute } from './customer-route';
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
  customerRoute,
  moderatorRoute,
  profileRoute,
];

export {
  customerRoute,
  homeRoute,
  moderatorRoute,
  ownerIndexRoute,
  ownerLayoutRoute,
  ownerMediaAddRoute,
  ownerMediaEditRoute,
  ownerMediaRoute,
  profileRoute,
};
