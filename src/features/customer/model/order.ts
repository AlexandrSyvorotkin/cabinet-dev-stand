import type { PlaceOrderFormValues } from './place-order-form';

export type CustomerOrderTabValue = 'in-progress' | 'special' | 'completed' | 'saved';

export type CustomerPlacedMedia = {
  id: string;
  mediaName: string;
  statusLabel: string;
  showGoogleIcon?: boolean;
};

export type CustomerOrder = {
  id: number;
  title: string;
  statusLabel: string;
  tab: CustomerOrderTabValue;
  newsUrl: string;
  keywords: string;
  rewriteType: string;
  hasSourceLink: boolean;
  hasAdSignature: boolean;
  canFullReprint: boolean;
  placementType: string;
  completedCount: number;
  totalCount: number;
  time: string;
  date: string;
  placedMedia: CustomerPlacedMedia[];
  depositedAmount: number;
  returnedAmount: number;
  deductedAmount: number;
  formData: PlaceOrderFormValues;
};

export const formatYesNo = (value: boolean): string => (value ? 'Да' : 'Нет');

export const CUSTOMER_BALANCE = 172_690;
