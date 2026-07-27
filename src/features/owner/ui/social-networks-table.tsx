import { Badge, Checkbox, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { SocialPlatformSelect } from '@/shared/ui/social-platform-select';
import { DataTable } from '@/shared/ui/data-table';
import {
  getSocialPlatformId,
  updateBasicServiceLabel,
  updateSocialPlatform,
  type BasicServiceItemConfig,
  type BasicServicesState,
} from '../model/basic-services';
import {
  isSocialPlatformActive,
  requiresRknCompliance,
  type SocialNetworksValues,
} from '../model/social-networks';

type SocialNetworksTableProps = {
  socialItems: BasicServiceItemConfig[];
  basicServices: BasicServicesState;
  onBasicServicesChange: (basicServices: BasicServicesState) => void;
  values: SocialNetworksValues;
  onChange: (values: SocialNetworksValues) => void;
};

const SocialNetworksTable = ({
  socialItems,
  basicServices,
  onBasicServicesChange,
  values,
  onChange,
}: SocialNetworksTableProps) => {
  const updateRow = (
    id: string,
    patch: Partial<SocialNetworksValues['platforms'][string]>,
  ) => {
    onChange({
      ...values,
      platforms: {
        ...values.platforms,
        [id]: { ...values.platforms[id], ...patch },
      },
    });
  };

  const updateLabel = (id: string, label: string) => {
    onBasicServicesChange(updateBasicServiceLabel(basicServices, id, label));
  };

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
      key: 'platform',
      title: 'Соцсеть',
      render: (config: BasicServiceItemConfig) => (
        <SocialPlatformSelect
          value={getSocialPlatformId(config)}
          onChange={(platformId) =>
            onBasicServicesChange(updateSocialPlatform(basicServices, config.id, platformId))
          }
        />
      ),
    },
    {
      key: 'link',
      title: 'Ссылка',
      render: (config: BasicServiceItemConfig) => {
        const row = values.platforms[config.id];

        return (
          <TextInput
            value={row?.link ?? ''}
            onChange={(event) => updateRow(config.id, { link: event.currentTarget.value })}
            placeholder="https://"
          />
        );
      },
    },
    {
      key: 'reachOrSubscribers',
      title: 'Посещаемость / подписчики',
      render: (config: BasicServiceItemConfig) => {
        const row = values.platforms[config.id];

        return (
          <NumberInput
            value={row?.reachOrSubscribers ? Number(row.reachOrSubscribers) : ''}
            onChange={(value) =>
              updateRow(config.id, { reachOrSubscribers: String(value ?? '') })
            }
            min={0}
            placeholder="—"
            thousandSeparator=" "
          />
        );
      },
    },
    {
      key: 'rknRegistered',
      title: 'Регистрация в РКН',
      render: (config: BasicServiceItemConfig) => {
        const row = values.platforms[config.id];
        const requiresRkn = requiresRknCompliance(row?.reachOrSubscribers ?? '');

        if (!requiresRkn) {
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        }

        return (
          <Checkbox
            label="Зарегистрирован"
            checked={row?.rknRegistered ?? false}
            onChange={(event) => {
              const checked = event.currentTarget.checked;

              updateRow(config.id, {
                rknRegistered: checked,
                rknNumber: checked ? row?.rknNumber ?? '' : '',
              });
            }}
          />
        );
      },
    },
    {
      key: 'rknFollowUp',
      title: 'Заявление / номер РКН',
      render: (config: BasicServiceItemConfig) => {
        const row = values.platforms[config.id];
        const requiresRkn = requiresRknCompliance(row?.reachOrSubscribers ?? '');

        if (!requiresRkn) {
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        }

        if (row?.rknRegistered) {
          return (
            <TextInput
              value={row.rknNumber}
              onChange={(event) =>
                updateRow(config.id, { rknNumber: event.currentTarget.value })
              }
              placeholder="Номер регистрации"
            />
          );
        }

        return (
          <Stack gap={4}>
            <Checkbox
              label="Подано заявление"
              checked={row?.rknApplicationSubmitted ?? false}
              onChange={(event) =>
                updateRow(config.id, {
                  rknApplicationSubmitted: event.currentTarget.checked,
                  rknNotSubmitted: event.currentTarget.checked ? false : row?.rknNotSubmitted,
                })
              }
            />
            <Checkbox
              label="Не подавал"
              checked={row?.rknNotSubmitted ?? false}
              onChange={(event) =>
                updateRow(config.id, {
                  rknNotSubmitted: event.currentTarget.checked,
                  rknApplicationSubmitted: event.currentTarget.checked
                    ? false
                    : row?.rknApplicationSubmitted,
                })
              }
            />
          </Stack>
        );
      },
    },
    {
      key: 'status',
      title: 'Статус',
      render: (config: BasicServiceItemConfig) => {
        const row = values.platforms[config.id];

        if (!row) {
          return null;
        }

        const isActive = isSocialPlatformActive(row);

        return (
          <Badge color={isActive ? 'green' : 'gray'} variant="light">
            {isActive ? 'Активно' : 'Неактивно'}
          </Badge>
        );
      },
    },
  ];

  if (socialItems.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        Соцсети появятся здесь из таблицы базовых услуг.
      </Text>
    );
  }

  return (
    <DataTable
      columns={columns}
      getRowKey={(config) => config.id}
      sections={[{ key: 'platforms', rows: socialItems }]}
    />
  );
};

export { SocialNetworksTable };
