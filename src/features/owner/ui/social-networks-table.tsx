import { Group, NumberInput, Text, TextInput } from '@mantine/core';
import { SocialPlatformIcon } from '@/shared/ui/social-platform-select';
import { DataTable } from '@/shared/ui/data-table';
import { getSocialPlatformId, type BasicServiceItemConfig } from '../model/basic-services';
import type { SocialNetworksValues } from '../model/social-networks';

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
