import { ActionIcon, Checkbox, Group, NumberInput, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { applyAgencyDiscountToPrice, parsePrice } from '@/shared/lib/pricing';
import { SocialPlatformSelect } from '@/shared/ui/social-platform-select';
import { DataTable } from '@/shared/ui/data-table';
import type { AgencyDiscount } from '../model/pricing';
import {
  addCustomPlacementService,
  addCustomSocialService,
  canAddSocialPlatform,
  canRemoveBasicService,
  getPlacementItems,
  getSocialItems,
  getSocialPlatformId,
  getUsedSocialPlatformIds,
  removeBasicService,
  updateBasicServiceLabel,
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
      title: 'Услуга',
      render: (config: BasicServiceItemConfig) => {
        if (config.group === 'social') {
          return (
            <SocialPlatformSelect
              value={getSocialPlatformId(config)}
              onChange={(platformId) =>
                onChange(updateSocialPlatform(values, config.id, platformId))
              }
              excludeIds={getUsedSocialPlatformIds(values, config.id)}
            />
          );
        }

        if (config.isCustom) {
          return (
            <TextInput
              value={config.label}
              onChange={(event) => updateLabel(config.id, event.currentTarget.value)}
              placeholder="Название"
            />
          );
        }

        return (
          <Stack gap={2}>
            <Text size="sm" fw={500}>
              {config.label}
            </Text>
            {config.hint ? (
              <Text size="xs" c="dimmed">
                {config.hint}
              </Text>
            ) : null}
          </Stack>
        );
      },
    },
    {
      key: 'maxChars',
      title: 'Кол. зн. макс',
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
      key: 'bonus',
      title: 'Бонус',
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];

        return (
          <Group justify="center">
            <Checkbox
              aria-label={`${config.label} — бонус`}
              checked={row?.bonus ?? false}
              onChange={(event) =>
                updateRow(config.id, { bonus: event.currentTarget.checked })
              }
            />
          </Group>
        );
      },
    },
    {
      key: 'discount',
      title: 'Скидка',
      render: (config: BasicServiceItemConfig) => {
        const row = values.values[config.id];

        return (
          <Group justify="center">
            <Checkbox
              aria-label={`${config.label} — скидка`}
              checked={row?.discount ?? false}
              onChange={(event) =>
                updateRow(config.id, { discount: event.currentTarget.checked })
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
          title: 'Тип размещения',
          rows: placementRows,
          onAdd: () => onChange(addCustomPlacementService(values)),
          addAriaLabel: 'Добавить тип размещения',
        },
        {
          key: 'social',
          title: 'Соцсети',
          rows: socialRows,
          onAdd: canAddSocialPlatform(values)
            ? () => onChange(addCustomSocialService(values))
            : undefined,
          addAriaLabel: 'Добавить соцсеть',
        },
      ]}
      footer={
        <Stack gap="xs">
          <Group align="center" wrap="wrap" gap="lg">
            <Checkbox
              label="Применять скидку агентству"
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
                aria-label="Процент скидки агентству"
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
