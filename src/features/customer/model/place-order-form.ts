export type OrderMaterialSource = 'document' | 'link' | 'images';

export type PlaceOrderFormValues = {
  materialSource: OrderMaterialSource;
  description: string;
  newsUrl: string;
  documentName: string;
  keywords: string;
  rewriteType: string;
  hasSourceLink: boolean;
  hasAdSignature: boolean;
  canFullReprint: boolean;
  placementType: string;
  erid: string;
  needsReview: boolean;
  timezoneRegion: string;
  placementDeadlineHours: number | '';
  textEditPercent: number | '';
};

export const ORDER_MATERIAL_SOURCE_OPTIONS: { value: OrderMaterialSource; label: string }[] = [
  { value: 'document', label: 'Документ' },
  { value: 'link', label: 'Ссылка' },
  { value: 'images', label: 'Картинки' },
];

export const REWRITE_TYPE_OPTIONS = ['Легкий', 'Средний', 'Сильный'];

export const PLACEMENT_TYPE_OPTIONS = ['PR-волна', 'Новость', 'Статья', 'Интервью', 'Спецпроект'];

export const TIMEZONE_REGION_OPTIONS = [
  'Москва (UTC+3)',
  'За Уралом (UTC+4)',
  'За Уралом (UTC+5)',
  'Без ограничений',
];

export const EMPTY_PLACE_ORDER_FORM: PlaceOrderFormValues = {
  materialSource: 'link',
  description: '',
  newsUrl: '',
  documentName: '',
  keywords: '',
  rewriteType: 'Легкий',
  hasSourceLink: true,
  hasAdSignature: false,
  canFullReprint: false,
  placementType: 'PR-волна',
  erid: '',
  needsReview: false,
  timezoneRegion: 'Москва (UTC+3)',
  placementDeadlineHours: 24,
  textEditPercent: '',
};

export const serializePlaceOrderPayload = (values: PlaceOrderFormValues) => ({
  materialSource: values.materialSource,
  description: values.description.trim(),
  newsUrl: values.materialSource === 'link' ? values.newsUrl.trim() : null,
  documentName: values.materialSource === 'document' ? values.documentName.trim() : null,
  keywords: values.keywords.trim(),
  rewriteType: values.rewriteType,
  hasSourceLink: values.hasSourceLink,
  hasAdSignature: values.hasAdSignature,
  canFullReprint: values.canFullReprint,
  placementType: values.placementType,
  erid: values.erid.trim() || null,
  needsReview: values.needsReview,
  timezoneRegion: values.timezoneRegion,
  placementDeadlineHours:
    values.placementDeadlineHours === '' ? null : values.placementDeadlineHours,
  textEditPercent: values.textEditPercent === '' ? null : values.textEditPercent,
});
