export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  AUTH_REGISTER: '/auth/register',
  PROFILE: '/profile',
  OWNER: '/owner',
  OWNER_MEDIA: '/owner/media',
  OWNER_MEDIA_NEW: '/owner/media/new',
  OWNER_MEDIA_DETAIL: '/owner/media/$mediaId',
  OWNER_MEDIA_EDIT: '/owner/media/$mediaId/edit',
  MODERATOR: '/moderator',
} as const;
