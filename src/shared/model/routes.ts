export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  OWNER: '/owner',
  OWNER_MEDIA: '/owner/media',
  OWNER_MEDIA_NEW: '/owner/media/new',
  OWNER_MEDIA_EDIT: '/owner/media/$mediaId/edit',
  CUSTOMER: '/customer',
  CUSTOMER_ORDER_NEW: '/customer/orders/new',
  CUSTOMER_ORDER_EDIT: '/customer/orders/$orderId/edit',
  MODERATOR: '/moderator',
} as const;
