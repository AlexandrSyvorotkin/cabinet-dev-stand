import { Badge, Checkbox, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { SocialPlatformIcon } from '@/shared/ui/social-platform-select';
import { DataTable } from '@/shared/ui/data-table';
import { getSocialPlatformId, type BasicServiceItemConfig } from '../model/basic-services';
import {
  isSocialPlatformActive,
  requiresRknCompliance,
  type SocialNetworksValues,
} from '../model/social-networks';

type SocialNetworksTableProps = {
  socialItems: BasicServiceItemConfig[];
  values: SocialNetworksValues;
  onChange: (values: SocialNetworksValues) => void;
};

const SocialNetworksTable = ({
  socialItems,
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

  const showRknNumberColumn = socialItems.some((config) => {
    const row = values.platforms[config.id];

    return (
      requiresRknCompliance(row?.reachOrSubscribers ?? '') && (row?.rknRegistered ?? false)
    );
  });

  const columns = [
    {
      key: 'label',
      title: 'Соцсеть',
      render: (config: BasicServiceItemConfig) => {
        const platformId = getSocialPlatformId(config);

        if (!platformId) {
          return (
            <Text size="sm" c="dimmed">
              Не выбрано
            </Text>
          );
        }

        return (
          <Group gap="xs" wrap="nowrap">
            <SocialPlatformIcon platformId={platformId} />
            <Text size="sm" fw={500}>
              {config.label}
            </Text>
          </Group>
        );
      },
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
      key: 'rknApplication',
      title: 'Заявление',
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
    ...(showRknNumberColumn
      ? [
          {
            key: 'rknNumber',
            title: 'Номер из РКН',
            render: (config: BasicServiceItemConfig) => {
              const row = values.platforms[config.id];
              const requiresRkn = requiresRknCompliance(row?.reachOrSubscribers ?? '');

              if (!requiresRkn || !row?.rknRegistered) {
                return (
                  <Text size="sm" c="dimmed">
                    —
                  </Text>
                );
              }

              return (
                <TextInput
                  value={row.rknNumber}
                  onChange={(event) =>
                    updateRow(config.id, { rknNumber: event.currentTarget.value })
                  }
                  placeholder="Номер регистрации"
                />
              );
            },
          },
        ]
      : []),
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
