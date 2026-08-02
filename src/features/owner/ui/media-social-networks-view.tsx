import { Anchor, Badge, Stack, Text } from '@mantine/core';
import { DataTable } from '@/shared/ui/data-table';
import {
  getSocialPlatformId,
  type BasicServiceItemConfig,
  type BasicServicesState,
} from '../model/basic-services';
import {
  isSocialPlatformActive,
  requiresRknCompliance,
  type SocialNetworksValues,
} from '../model/social-networks';
import { getSocialPlatformById } from '@/shared/model/social-platforms';

type MediaSocialNetworksViewProps = {
  basicServices: BasicServicesState;
  socialNetworks: SocialNetworksValues;
  socialItems: BasicServiceItemConfig[];
};

const formatRknStatus = (row: SocialNetworksValues['platforms'][string]): string => {
  if (!requiresRknCompliance(row.reachOrSubscribers)) {
    return 'Не требуется';
  }

  if (row.rknRegistered && row.rknNumber.trim()) {
    return `Зарегистрирован, № ${row.rknNumber.trim()}`;
  }

  if (row.rknApplicationSubmitted) {
    return 'Заявление подано';
  }

  if (row.rknNotSubmitted) {
    return 'Не подавал';
  }

  return 'Не указано';
};

const MediaSocialNetworksView = ({
  socialNetworks,
  socialItems,
}: MediaSocialNetworksViewProps) => {
  if (socialItems.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        Соцсети не указаны.
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
      key: 'platform',
      title: 'Соцсеть',
      render: (config: BasicServiceItemConfig) => {
        const platformId = getSocialPlatformId(config);
        return (
          <Text size="sm">
            {platformId ? getSocialPlatformById(platformId).label : '—'}
          </Text>
        );
      },
    },
    {
      key: 'link',
      title: 'Ссылка',
      render: (config: BasicServiceItemConfig) => {
        const link = socialNetworks.platforms[config.id]?.link.trim();

        if (!link) {
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        }

        return (
          <Anchor href={link} target="_blank" rel="noopener noreferrer" size="sm">
            {link}
          </Anchor>
        );
      },
    },
    {
      key: 'reachOrSubscribers',
      title: 'Посещаемость / подписчики',
      render: (config: BasicServiceItemConfig) => {
        const value = socialNetworks.platforms[config.id]?.reachOrSubscribers.trim();
        return <Text size="sm">{value || '—'}</Text>;
      },
    },
    {
      key: 'rkn',
      title: 'РКН',
      render: (config: BasicServiceItemConfig) => {
        const row = socialNetworks.platforms[config.id];

        if (!row) {
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        }

        return <Text size="sm">{formatRknStatus(row)}</Text>;
      },
    },
    {
      key: 'status',
      title: 'Статус',
      render: (config: BasicServiceItemConfig) => {
        const row = socialNetworks.platforms[config.id];

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

  return (
    <Stack gap="sm">
      <DataTable
        columns={columns}
        getRowKey={(config) => config.id}
        sections={[{ key: 'platforms', rows: socialItems }]}
        footer={
          socialNetworks.photo || socialNetworks.video ? (
            <Text size="sm">
              Дополнительно:{' '}
              {[socialNetworks.photo ? 'фото' : null, socialNetworks.video ? 'видео' : null]
                .filter(Boolean)
                .join(', ')}
            </Text>
          ) : undefined
        }
      />
    </Stack>
  );
};

export { MediaSocialNetworksView };
