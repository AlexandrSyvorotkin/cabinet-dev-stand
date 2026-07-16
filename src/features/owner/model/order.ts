export type OwnerOrderTabValue =
  | 'pool'
  | 'in-progress'
  | 'moderation'
  | 'completed';

export type OwnerOrder = {
  id: number;
  title: string;
  statusLabel: string;
  tab: OwnerOrderTabValue;
  newsUrl: string;
  keywords: string;
  rewriteType: string;
  hasSourceLink: boolean;
  hasAdSignature: boolean;
  canFullReprint: boolean;
  placementType: string;
  mediaCount?: number;
  amount?: number;
  completedAmount?: number;
  completedAt?: string;
};

export const formatYesNo = (value: boolean): string => {
  return value ? 'Да' : 'Нет';
};
