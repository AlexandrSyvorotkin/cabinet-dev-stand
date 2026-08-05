import {
  ActionIcon,
  Checkbox,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { applyAgencyDiscountToPrice, parsePrice } from '@/shared/lib/pricing';
import { PLACEMENT_CHARS_TOOLTIP } from '@/shared/model/placement-types';
import { InfoHintIcon } from '@/shared/ui/info-hint-icon';
import { PlacementTypeSelect } from '@/shared/ui/placement-type-select';
import { SocialPlatformSelect } from '@/shared/ui/social-platform-select';
import { DataTable } from '@/shared/ui/data-table';
import {
  BASIC_SERVICE_BONUS_COLUMN_HINT,
  BASIC_SERVICE_DISCOUNT_COLUMN_HINT,
} from '../model/basic-services-hints';
import {
  PACKAGE_KIND_COLORS,
  PACKAGE_KIND_HEADER_BG,
} from '../model/package-kind-theme';
import type { AgencyDiscount } from '../model/pricing';
import {
  addCustomPlacementService,
  addCustomSocialService,
  canRemoveBasicService,
  getPlacementItems,
  getPlacementTypeId,
  getSocialItems,
  getSocialPlatformId,
  isHeadlineLimitDisabled,
  isMaxCharsDisabled,
  removeBasicService,
  updateBasicServiceItem,
  updateBasicServiceLabel,
  updatePlacementType,
  updateSocialPlatform,
  type BasicServiceItem,
  type BasicServicesState,
} from '../model/basic-services';

type BasicServicesTableProps = {
  values: BasicServicesState;
  onChange: (values: BasicServicesState) => void;
  agencyDiscount: AgencyDiscount;
  onAgencyDiscountChange: (agencyDiscount: AgencyDiscount) => void;
};

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const BasicServicesTable = ({
  values,
  onChange,
  agencyDiscount,
  onAgencyDiscountChange,
}: BasicServicesTableProps) => {
  const updateRow = (id: string, patch: Partial<BasicServiceItem>) => {
    onChange(updateBasicServiceItem(values, id, patch));
  };

  const updateLabel = (id: string, label: string) => {
    onChange(updateBasicServiceLabel(values, id, label));
  };

  const handleRemove = (id: string) => {
    const nextState = removeBasicService(values, id);

    if (nextState) {
      onChange(nextState);
    }
  };

  const placementRows = getPlacementItems(values);
  const socialRows = getSocialItems(values);

  const columns = [
    {
      key: 'label',
      title: 'Услуга (название)',
      render: (item: BasicServiceItem) => (
        <TextInput
          value={item.label}
          onChange={(event) => updateLabel(item.id, event.currentTarget.value)}
          placeholder="Название"
        />
      ),
    },
    {
      key: 'placementType',
      title: 'Тип размещения',
      render: (item: BasicServiceItem) => {
        if (item.group === 'social') {
          return (
            <SocialPlatformSelect
              value={getSocialPlatformId(item)}
              onChange={(platformId) =>
                onChange(updateSocialPlatform(values, item.id, platformId))
              }
            />
          );
        }

        return (
          <PlacementTypeSelect
            value={getPlacementTypeId(item)}
            onChange={(placementTypeId) =>
              onChange(updatePlacementType(values, item.id, placementTypeId))
            }
          />
        );
      },
    },
    {
      key: 'maxChars',
      title: (
        <Group gap={6} wrap="nowrap">
          <Text span size="sm" fw={600}>
            Кол. зн. макс
          </Text>
          <InfoHintIcon label={PLACEMENT_CHARS_TOOLTIP} />
        </Group>
      ),
      render: (item: BasicServiceItem) => (
        <NumberInput
          value={item.maxChars ? Number(item.maxChars) : ''}
          onChange={(value) => updateRow(item.id, { maxChars: String(value ?? '') })}
          min={0}
          placeholder="—"
          disabled={isMaxCharsDisabled(item)}
        />
      ),
    },
    {
      key: 'headlineLimit',
      title: 'Заголовок',
      render: (item: BasicServiceItem) => (
        <NumberInput
          value={item.headlineLimit ? Number(item.headlineLimit) : ''}
          onChange={(value) => updateRow(item.id, { headlineLimit: String(value ?? '') })}
          min={0}
          placeholder="—"
          disabled={isHeadlineLimitDisabled(item)}
        />
      ),
    },
    {
      key: 'price',
      title: 'Цена, руб.',
      render: (item: BasicServiceItem) => {
        const basePrice = parsePrice(item.price);
        const agencyPrice =
          agencyDiscount?.enabled && basePrice > 0
            ? applyAgencyDiscountToPrice(basePrice, agencyDiscount)
            : null;

        return (
          <Stack gap={2}>
            <NumberInput
              value={item.price ? Number(item.price) : ''}
              onChange={(value) => updateRow(item.id, { price: String(value ?? '') })}
              min={0}
              placeholder="—"
              thousandSeparator=" "
            />
            {agencyPrice != null && agencyPrice !== basePrice ? (
              <Text size="xs" c="dimmed">
                Для агентства: {formatAmount(agencyPrice)} ₽
              </Text>
            ) : null}
          </Stack>
        );
      },
    },
    {
      key: 'discount',
      headerStyle: { background: PACKAGE_KIND_HEADER_BG.discount },
      getCellStyle: (item: BasicServiceItem) =>
        item.discount ? { background: PACKAGE_KIND_HEADER_BG.discount } : undefined,
      title: (
        <Group gap={6} wrap="nowrap" justify="center">
          <Text span size="sm" fw={600} c={PACKAGE_KIND_COLORS.discount}>
            Скидка
          </Text>
          <InfoHintIcon label={BASIC_SERVICE_DISCOUNT_COLUMN_HINT} />
        </Group>
      ),
      render: (item: BasicServiceItem) => (
        <Group justify="center">
          <Checkbox
            aria-label={`${item.label} — скидка`}
            checked={item.discount}
            color={PACKAGE_KIND_COLORS.discount}
            onChange={(event) => updateRow(item.id, { discount: event.currentTarget.checked })}
          />
        </Group>
      ),
    },
    {
      key: 'bonus',
      headerStyle: { background: PACKAGE_KIND_HEADER_BG.bonus },
      getCellStyle: (item: BasicServiceItem) =>
        item.bonus ? { background: PACKAGE_KIND_HEADER_BG.bonus } : undefined,
      title: (
        <Group gap={6} wrap="nowrap" justify="center">
          <Text span size="sm" fw={600} c={PACKAGE_KIND_COLORS.bonus}>
            Бонус
          </Text>
          <InfoHintIcon label={BASIC_SERVICE_BONUS_COLUMN_HINT} />
        </Group>
      ),
      render: (item: BasicServiceItem) => (
        <Group justify="center">
          <Checkbox
            aria-label={`${item.label} — бонус`}
            checked={item.bonus}
            color={PACKAGE_KIND_COLORS.bonus}
            onChange={(event) => updateRow(item.id, { bonus: event.currentTarget.checked })}
          />
        </Group>
      ),
    },
    {
      key: 'actions',
      title: '',
      render: (item: BasicServiceItem) => {
        const removable = canRemoveBasicService(values, item.id);

        return (
          <Group justify="center">
            <Tooltip
              label={
                removable
                  ? 'Удалить'
                  : 'Нельзя удалить последний элемент в секции'
              }
            >
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                aria-label={`Удалить ${item.label}`}
                disabled={!removable}
                onClick={() => handleRemove(item.id)}
              >
                ×
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      getRowKey={(item) => item.id}
      sections={[
        {
          key: 'placement',
          rows: placementRows,
          onAdd: () => onChange(addCustomPlacementService(values)),
          addAriaLabel: 'Добавить тип размещения',
        },
        {
          key: 'social',
          title: 'Соцсети',
          rows: socialRows,
          onAdd: () => onChange(addCustomSocialService(values)),
          addAriaLabel: 'Добавить соцсеть',
        },
      ]}
      footer={
        <Stack gap="xs">
          <Group align="center" wrap="wrap" gap="lg">
            <Checkbox
              label="Применять скидку площадке"
              checked={agencyDiscount.enabled}
              onChange={(event) =>
                onAgencyDiscountChange({
                  ...agencyDiscount,
                  enabled: event.currentTarget.checked,
                })
              }
            />
            <Group align="center" gap="xs" wrap="nowrap">
              <Text size="sm" fw={500}>
                Процент
              </Text>
              <NumberInput
                suffix="%"
                value={agencyDiscount.percent}
                onChange={(value) =>
                  onAgencyDiscountChange({
                    ...agencyDiscount,
                    percent: Number(value) || 0,
                  })
                }
                min={0}
                max={100}
                disabled={!agencyDiscount.enabled}
                w={120}
                aria-label="Процент скидки площадке"
              />
            </Group>
          </Group>
          <Text size="xs" c="dimmed">
            Уменьшает все цены из таблицы базовых услуг на указанный процент.
          </Text>
        </Stack>
      }
    />
  );
};

export { BasicServicesTable };
