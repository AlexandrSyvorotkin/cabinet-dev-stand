export const MEDIA_THEME_SELECT_ALL = 'Выбрать все';

export const MEDIA_THEMES = [
  'Политика',
  'Общество',
  'Экономика',
  'Бизнес',
  'В мире',
  'Авиа',
  'Авто/Транспорт',
  'Безопасность',
  'Военное дело',
  'Культура/Шоу-бизнес',
  'Медицина',
  'Недвижимость/строительство',
  'Образование и наука',
  'Происшествия',
  'Промышленность',
  'Сельское хозяйство',
  'Спорт',
  'Экспертное мнение',
  'IT и Технологии',
  'Сотрудничество',
] as const;

export const MEDIA_THEME_OPTIONS = [
  MEDIA_THEME_SELECT_ALL,
  ...MEDIA_THEMES,
] as const;

export const areAllMediaThemesSelected = (themes: string[]) =>
  themes.length === MEDIA_THEMES.length;

export const getMediaThemeSelectValue = (themes: string[]) =>
  areAllMediaThemesSelected(themes) ? [MEDIA_THEME_SELECT_ALL, ...themes] : themes;

export const normalizeMediaThemeSelection = (
  selected: string[],
  previousThemes: string[],
): string[] => {
  const includesSelectAll = selected.includes(MEDIA_THEME_SELECT_ALL);
  const themes = selected.filter((item) => item !== MEDIA_THEME_SELECT_ALL);
  const hadAll = areAllMediaThemesSelected(previousThemes);

  if (includesSelectAll && !hadAll) {
    return [...MEDIA_THEMES];
  }

  if (!includesSelectAll && hadAll && themes.length === MEDIA_THEMES.length) {
    return [];
  }

  return themes;
};
