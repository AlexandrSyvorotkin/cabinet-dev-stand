export type ModerationStatus = 'new' | 'moderation' | 'rejected' | 'approved';

export const MODERATION_STATUS_LABELS: Record<ModerationStatus, string> = {
  new: 'Новый',
  moderation: 'На модерации',
  rejected: 'Отклонено',
  approved: 'Одобрено',
};

export const MODERATION_STATUS_COLORS: Record<ModerationStatus, string> = {
  new: 'blue',
  moderation: 'orange',
  rejected: 'red',
  approved: 'green',
};
