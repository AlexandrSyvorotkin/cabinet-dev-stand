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
  removeBasicService,
  updateBasicServiceLabel,
  updatePlacementType,
  updateSocialPlatform,
  type BasicServiceItemConfig,
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
  const updateRow = (id: string, patch: Partial<BasicServicesState['values'][string]>) => {
    onChange({
      ...values,
      values: {
        ...values.values,
        [id]: { ...values.values[id], ...patch },
      },
    });
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
      render: (config: BasicServiceItemConfig) => (
        <TextInput
          value={config.label}
          onChange={(event) => updateLabel(config.id, event.currentTarget.value)}
          placeholder="Название"
        />
      ),
    },
    {
      key: 'placementType',
      title: 'Тип размещения',
      render: (config: BasicServiceItemConfig) => {
        if (config.group === 'social') {
          return (
            <SocialPlatformSelect
              value={getSocialPlatformId(config)}
              onChange={(platformId) =>
                onChange(updateSocialPlatform(values, config.id, platformId))
              }
            />
          );
        }

        return (
          <PlacementTypeSelect
            value={getPlacementTypeId(config)}
            onChange={(placementTypeId) =>
              onChange(updatePlacementType(values, config.id, placementTypeId))
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
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];

        return (
          <NumberInput
            value={row?.maxChars ? Number(row.maxChars) : ''}
            onChange={(value) => updateRow(config.id, { maxChars: String(value ?? '') })}
            min={0}
            placeholder="—"
            disabled={config.defaultMaxChars === null}
          />
        );
      },
    },
    {
      key: 'headlineLimit',
      title: 'Заголовок',
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];

        return (
          <NumberInput
            value={row?.headlineLimit ? Number(row.headlineLimit) : ''}
            onChange={(value) =>
              updateRow(config.id, { headlineLimit: String(value ?? '') })
            }
            min={0}
            placeholder="—"
            disabled={config.defaultHeadline === null}
          />
        );
      },
    },
    {
      key: 'price',
      title: 'Цена, руб.',
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];
        const basePrice = parsePrice(row?.price);
        const agencyPrice =
          agencyDiscount?.enabled && basePrice > 0
            ? applyAgencyDiscountToPrice(basePrice, agencyDiscount)
            : null;

        return (
          <Stack gap={2}>
            <NumberInput
              value={row?.price ? Number(row.price) : ''}
              onChange={(value) => updateRow(config.id, { price: String(value ?? '') })}
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
      getCellStyle: (config: BasicServiceItemConfig) =>
        values.values[config.id]?.discount
          ? { background: PACKAGE_KIND_HEADER_BG.discount }
          : undefined,
      title: (
        <Group gap={6} wrap="nowrap" justify="center">
          <Text span size="sm" fw={600} c={PACKAGE_KIND_COLORS.discount}>
            Скидка
          </Text>
          <InfoHintIcon label={BASIC_SERVICE_DISCOUNT_COLUMN_HINT} />
        </Group>
      ),
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];

        return (
          <Group justify="center">
            <Checkbox
              aria-label={`${config.label} — скидка`}
              checked={row?.discount ?? false}
              color={PACKAGE_KIND_COLORS.discount}
              onChange={(event) =>
                updateRow(config.id, { discount: event.currentTarget.checked })
              }
            />
          </Group>
        );
      },
    },
    {
      key: 'bonus',
      headerStyle: { background: PACKAGE_KIND_HEADER_BG.bonus },
      getCellStyle: (config: BasicServiceItemConfig) =>
        values.values[config.id]?.bonus
          ? { background: PACKAGE_KIND_HEADER_BG.bonus }
          : undefined,
      title: (
        <Group gap={6} wrap="nowrap" justify="center">
          <Text span size="sm" fw={600} c={PACKAGE_KIND_COLORS.bonus}>
            Бонус
          </Text>
          <InfoHintIcon label={BASIC_SERVICE_BONUS_COLUMN_HINT} />
        </Group>
      ),
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];

        return (
          <Group justify="center">
            <Checkbox
              aria-label={`${config.label} — бонус`}
              checked={row?.bonus ?? false}
              color={PACKAGE_KIND_COLORS.bonus}
              onChange={(event) =>
                updateRow(config.id, { bonus: event.currentTarget.checked })
              }
            />
          </Group>
        );
      },
    },
    {
      key: 'actions',
      title: '',
      render: (config: BasicServiceItemConfig) => {
        const removable = canRemoveBasicService(values, config.id);

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
                aria-label={`Удалить ${config.label}`}
                disabled={!removable}
                onClick={() => handleRemove(config.id)}
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
      getRowKey={(config) => config.id}
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
