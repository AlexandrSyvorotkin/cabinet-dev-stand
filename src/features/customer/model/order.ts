export type CustomerOrderTabValue = 'active' | 'completed';

export type RewriteLevel = 'light' | 'strong';

export type CustomerMediaPlacementStatus = 'pending' | 'accepted' | 'refused';

export type RefusalReason =
  | 'topic-mismatch'
  | 'already-published'
  | 'erid'
  | 'need-more-time';

export const REFUSAL_REASON_LABELS: Record<RefusalReason, string> = {
  'topic-mismatch': 'Не соответствует тематике',
  'already-published': 'Уже была опубликована',
  erid: 'Проблемы с ERID',
  'need-more-time': 'Нужно увеличить время',
};

export const REWRITE_LEVEL_LABELS: Record<RewriteLevel, string> = {
  light: 'Легкий',
  strong: 'Сильный',
};

export type CustomerMediaPlacement = {
  id: string;
  mediaName: string;
  status: CustomerMediaPlacementStatus;
  refusalReason?: RefusalReason;
  hasDocument: boolean;
  hasDescription: boolean;
  rewriteRequired: boolean;
  advertisingRequired: boolean;
  eridMarking: boolean;
};

export type CustomerOrderMessage = {
  id: string;
  author: 'moderator' | 'customer';
  text: string;
  createdAt: string;
};

export type CustomerOrder = {
  id: number;
  title: string;
  statusLabel: string;
  tab: CustomerOrderTabValue;
  sourceLink: string;
  sourceDocumentName?: string;
  hasImages: boolean;
  description: string;
  placementType: string;
  characterCount: number;
  priceAmount: number;
  isAdvertising: boolean;
  needsEridRegistration: boolean;
  eridToken?: string;
  regionNote?: string;
  placementHours: number;
  headlines: string;
  rewriteLevel: RewriteLevel;
  rewritePercent: number;
  mediaPlacements: CustomerMediaPlacement[];
  comment: string;
  resultLink?: string;
  messages: CustomerOrderMessage[];
  mediaCount?: number;
  amount?: number;
  completedAt?: string;
};
