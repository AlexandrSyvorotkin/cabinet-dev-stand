export const PACKAGE_KIND_COLORS = {
  discount: 'blue',
  bonus: 'grape',
} as const;

export const PACKAGE_KIND_HEADER_BG = {
  discount: 'var(--mantine-color-blue-0)',
  bonus: 'var(--mantine-color-grape-0)',
} as const;

export const PACKAGE_KIND_PANEL_BORDER = {
  discount: 'var(--mantine-color-blue-2)',
  bonus: 'var(--mantine-color-grape-2)',
} as const;

export const PACKAGE_KIND_ACCENT = {
  discount: 'var(--mantine-color-blue-5)',
  bonus: 'var(--mantine-color-grape-5)',
} as const;

export type PackageKind = keyof typeof PACKAGE_KIND_COLORS;
