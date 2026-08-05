import { Badge, Group, Stack, Text } from '@mantine/core';
import { applyAgencyDiscountToPrice, parsePrice } from '@/shared/lib/pricing';
import { getPlacementTypeConfig } from '@/shared/model/placement-types';
import { getSocialPlatformById } from '@/shared/model/social-platforms';
import { DataTable } from '@/shared/ui/data-table';
import {
  getPlacementItems,
  getPlacementTypeId,
  getSocialItems,
  getSocialPlatformId,
  type BasicServiceItemConfig,
  type BasicServicesState,
} from '../model/basic-services';
import {
  PACKAGE_KIND_COLORS,
  PACKAGE_KIND_HEADER_BG,
} from '../model/package-kind-theme';
import type { AgencyDiscount } from '../model/pricing';

type MediaPricesTableViewProps = {
  basicServices: BasicServicesState;
  agencyDiscount: AgencyDiscount;
};

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const formatCellValue = (value: string | null | undefined): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '—';
};

const formatPrice = (value: string, agencyDiscount: AgencyDiscount): string => {
  const basePrice = parsePrice(value);

  if (basePrice <= 0) {
    return '—';
  }

  const agencyPrice =
    agencyDiscount.enabled && agencyDiscount.percent > 0
      ? applyAgencyDiscountToPrice(basePrice, agencyDiscount)
      : null;

  if (agencyPrice != null && agencyPrice !== basePrice) {
    return `${formatAmount(basePrice)} ₽ (агентству: ${formatAmount(agencyPrice)} ₽)`;
  }

  return `${formatAmount(basePrice)} ₽`;
};

const getServiceTypeLabel = (config: BasicServiceItemConfig): string => {
  if (config.group === 'social') {
    const platformId = getSocialPlatformId(config);
    return platformId ? getSocialPlatformById(platformId).label : '—';
  }

  const placementTypeId = getPlacementTypeId(config);
  return placementTypeId ? getPlacementTypeConfig(placementTypeId).label : '—';
};

const MediaPricesTableView = ({ basicServices, agencyDiscount }: MediaPricesTableViewProps) => {
  const placementRows = getPlacementItems(basicServices);
  const socialRows = getSocialItems(basicServices);

  if (placementRows.length === 0 && socialRows.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        Базовые услуги не указаны.
      </Text>
    );
  }

  const columns = [
    {
      key: 'label',
      title: 'Услуга',
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{config.label.trim() || '—'}</Text>
      ),
    },
    {
      key: 'type',
      title: 'Тип размещения',
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{getServiceTypeLabel(config)}</Text>
      ),
    },
    {
      key: 'maxChars',
      title: 'Кол. зн. макс',
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{formatCellValue(config.maxChars)}</Text>
      ),
    },
    {
      key: 'headlineLimit',
      title: 'Заголовок',
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{formatCellValue(config.headlineLimit)}</Text>
      ),
    },
    {
      key: 'price',
      title: 'Цена, руб.',
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{formatPrice(config.price, agencyDiscount)}</Text>
      ),
    },
    {
      key: 'discount',
      headerStyle: { background: PACKAGE_KIND_HEADER_BG.discount },
      getCellStyle: (config: BasicServiceItemConfig) =>
        config.discount ? { background: PACKAGE_KIND_HEADER_BG.discount } : undefined,
      title: (
        <Text span size="sm" fw={600} c={PACKAGE_KIND_COLORS.discount}>
          Скидка
        </Text>
      ),
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{config.discount ? 'Да' : '—'}</Text>
      ),
    },
    {
      key: 'bonus',
      headerStyle: { background: PACKAGE_KIND_HEADER_BG.bonus },
      getCellStyle: (config: BasicServiceItemConfig) =>
        config.bonus ? { background: PACKAGE_KIND_HEADER_BG.bonus } : undefined,
      title: (
        <Text span size="sm" fw={600} c={PACKAGE_KIND_COLORS.bonus}>
          Бонус
        </Text>
      ),
      render: (config: BasicServiceItemConfig) => (
        <Text size="sm">{config.bonus ? 'Да' : '—'}</Text>
      ),
    },
  ];

  return (
    <Stack gap="sm">
      <DataTable
        columns={columns}
        getRowKey={(config) => config.id}
        sections={[
          { key: 'placement', rows: placementRows },
          { key: 'social', title: 'Соцсети', rows: socialRows },
        ]}
        footer={
          agencyDiscount.enabled ? (
            <Group gap="xs">
              <Badge color="green" variant="light">
                Агентству −{agencyDiscount.percent}%
              </Badge>
              <Text size="sm" c="dimmed">
                Скидка применяется ко всем ценам из таблицы.
              </Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">
              Скидка агентству не применяется.
            </Text>
          )
        }
      />
    </Stack>
  );
};

export { MediaPricesTableView };
