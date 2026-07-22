import type { PlaceOrderFormValues } from './place-order-form';
import type { CustomerOrder } from './order';

const formatOrderDate = (date: Date): string =>
  date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatOrderTime = (date: Date): string =>
  date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

const resolveMaterialLabel = (values: PlaceOrderFormValues): string => {
  if (values.materialSource === 'link') {
    return values.newsUrl.trim() || 'Ссылка не указана';
  }

  if (values.materialSource === 'document') {
    return values.documentName.trim() || 'Документ';
  }

  return values.documentName.trim() || 'Изображения';
};

const mapOrderFieldsFromForm = (values: PlaceOrderFormValues) => ({
  formData: values,
  newsUrl: resolveMaterialLabel(values),
  keywords: values.keywords.trim() || '—',
  rewriteType: values.rewriteType,
  hasSourceLink: values.hasSourceLink,
  hasAdSignature: values.hasAdSignature,
  canFullReprint: values.canFullReprint,
  placementType: values.placementType,
});

const createCustomerOrderFromForm = (
  values: PlaceOrderFormValues,
  id: number,
): CustomerOrder => {
  const now = new Date();

  return {
    id,
    title: 'Ручное размещение СМИ',
    statusLabel: 'в работе',
    tab: 'in-progress',
    completedCount: 0,
    totalCount: 0,
    time: formatOrderTime(now),
    date: formatOrderDate(now),
    placedMedia: [],
    depositedAmount: 0,
    returnedAmount: 0,
    deductedAmount: 0,
    ...mapOrderFieldsFromForm(values),
  };
};

const updateCustomerOrderFromForm = (
  order: CustomerOrder,
  values: PlaceOrderFormValues,
): CustomerOrder => ({
  ...order,
  ...mapOrderFieldsFromForm(values),
});

const inferFormDataFromOrder = (order: CustomerOrder): PlaceOrderFormValues => {
  if (order.formData) {
    return structuredClone(order.formData);
  }

  const isLink = order.newsUrl.startsWith('http');

  return {
    materialSource: isLink ? 'link' : 'document',
    description: '',
    newsUrl: isLink ? order.newsUrl : '',
    documentName: isLink ? '' : order.newsUrl,
    keywords: order.keywords === '—' ? '' : order.keywords,
    rewriteType: order.rewriteType,
    hasSourceLink: order.hasSourceLink,
    hasAdSignature: order.hasAdSignature,
    canFullReprint: order.canFullReprint,
    placementType: order.placementType,
    erid: '',
    needsReview: false,
    timezoneRegion: 'Москва (UTC+3)',
    placementDeadlineHours: 24,
    textEditPercent: '',
  };
};

export {
  createCustomerOrderFromForm,
  inferFormDataFromOrder,
  updateCustomerOrderFromForm,
};
