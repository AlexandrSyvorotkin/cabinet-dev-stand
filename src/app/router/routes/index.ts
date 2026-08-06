import { homeRoute } from './home-route';
import {
  moderatorHelpRoute,
  moderatorOrdersRoute,
  moderatorRejectedRoute,
  moderatorSettingsRoute,
  moderatorUsersRoute,
} from './moderator-section-routes';
import { moderatorIndexRoute } from './moderator-index-route';
import { moderatorLayoutRoute } from './moderator-layout-route';
import { moderatorMediaRoute } from './moderator-media-route';
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
  moderatorLayoutRoute.addChildren([
    moderatorIndexRoute,
    moderatorMediaRoute,
    moderatorOrdersRoute,
    moderatorUsersRoute,
    moderatorRejectedRoute,
    moderatorSettingsRoute,
    moderatorHelpRoute,
  ]),
  profileRoute,
];

export {
  homeRoute,
  moderatorHelpRoute,
  moderatorIndexRoute,
  moderatorLayoutRoute,
  moderatorMediaRoute,
  moderatorOrdersRoute,
  moderatorRejectedRoute,
  moderatorSettingsRoute,
  moderatorUsersRoute,
  ownerIndexRoute,
  ownerLayoutRoute,
  ownerMediaAddRoute,
  ownerMediaDetailRoute,
  ownerMediaEditRoute,
  ownerMediaRoute,
  profileRoute,
};
