export const PLACEMENT_TYPE_IDS = ['news', 'article', 'interview', 'specialProject'] as const;

export type PlacementTypeId = (typeof PLACEMENT_TYPE_IDS)[number];

export type PlacementTypeConfig = {
  id: PlacementTypeId;
  label: string;
  defaultMaxChars: number | null;
  defaultHeadline: number | null;
  defaultPrice: number | null;
  hint?: string;
};

export const PLACEMENT_TYPES: PlacementTypeConfig[] = [
  {
    id: 'news',
    label: 'Новость',
    defaultMaxChars: 1500,
    defaultHeadline: 50,
    defaultPrice: 8_000,
  },
  {
    id: 'article',
    label: 'Статья',
    defaultMaxChars: 5000,
    defaultHeadline: 100,
    defaultPrice: 25_000,
  },
  {
    id: 'interview',
    label: 'Интервью',
    defaultMaxChars: 5000,
    defaultHeadline: 200,
    defaultPrice: 35_000,
    hint: 'от',
  },
  {
    id: 'specialProject',
    label: 'Спецпроект',
    defaultMaxChars: null,
    defaultHeadline: null,
    defaultPrice: 120_000,
    hint: 'без ограничений',
  },
];

export const PLACEMENT_TYPE_OPTIONS = PLACEMENT_TYPES.map((item) => ({
  value: item.id,
  label: item.label,
}));

export const isPlacementTypeId = (value: string): value is PlacementTypeId =>
  PLACEMENT_TYPE_IDS.includes(value as PlacementTypeId);

export const getPlacementTypeConfig = (placementTypeId: PlacementTypeId): PlacementTypeConfig =>
  PLACEMENT_TYPES.find((item) => item.id === placementTypeId)!;

const formatCharsCount = (value: number): string => value.toLocaleString('ru-RU');

export const PLACEMENT_CHARS_TOOLTIP = PLACEMENT_TYPES.map((type) => {
  if (type.defaultMaxChars == null) {
    return `${type.label} — без ограничений`;
  }

  const headline =
    type.defaultHeadline != null ? `, заголовок — ${formatCharsCount(type.defaultHeadline)}` : '';

  return `${type.label} — ${formatCharsCount(type.defaultMaxChars)} знаков${headline}`;
}).join('\n');

export const getPlacementMaxCharsHint = (placementTypeId: PlacementTypeId | null): string | null => {
  if (!placementTypeId) {
    return null;
  }

  const type = getPlacementTypeConfig(placementTypeId);

  if (type.defaultMaxChars == null) {
    return 'Без ограничений';
  }

  return `Обычно ${formatCharsCount(type.defaultMaxChars)} знаков`;
};

export const getPlacementTypeCharsTooltip = (
  placementTypeId: PlacementTypeId | null,
): string | null => {
  if (!placementTypeId) {
    return null;
  }

  const type = getPlacementTypeConfig(placementTypeId);

  if (type.defaultMaxChars == null) {
    return `${type.label}: без ограничений по знакам и заголовку`;
  }

  const parts = [`${type.label}: до ${formatCharsCount(type.defaultMaxChars)} знаков`];

  if (type.defaultHeadline != null) {
    parts.push(`заголовок до ${formatCharsCount(type.defaultHeadline)} знаков`);
  }

  return parts.join(', ');
};

export const getDefaultMaxCharsHint = (defaultMaxChars: number | null | undefined): string | null => {
  if (defaultMaxChars == null) {
    return null;
  }

  return `Обычно ${formatCharsCount(defaultMaxChars)} знаков`;
};
