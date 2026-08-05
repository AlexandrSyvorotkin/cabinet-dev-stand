import { Anchor, Badge, Stack, Text } from '@mantine/core';
import { DataTable } from '@/shared/ui/data-table';
import {
  getSocialPlatformId,
  type BasicServiceItem,
  type BasicServicesState,
} from '../model/basic-services';
import {
  getSocialNetworkById,
  isSocialPlatformActive,
  requiresRknCompliance,
  type SocialNetworkRowValues,
  type SocialNetworksValues,
} from '../model/social-networks';
import { getSocialPlatformById } from '@/shared/model/social-platforms';

type MediaSocialNetworksViewProps = {
  basicServices: BasicServicesState;
  socialNetworks: SocialNetworksValues;
  socialItems: BasicServiceItem[];
};

const formatRknStatus = (row: SocialNetworkRowValues): string => {
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
      render: (config: BasicServiceItem) => (
        <Text size="sm">{config.label.trim() || '—'}</Text>
      ),
    },
    {
      key: 'platform',
      title: 'Соцсеть',
      render: (config: BasicServiceItem) => {
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
      render: (config: BasicServiceItem) => {
        const link = getSocialNetworkById(socialNetworks, config.id)?.link.trim();

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
      render: (config: BasicServiceItem) => {
        const value = getSocialNetworkById(socialNetworks, config.id)?.reachOrSubscribers.trim();
        return <Text size="sm">{value || '—'}</Text>;
      },
    },
    {
      key: 'rkn',
      title: 'РКН',
      render: (config: BasicServiceItem) => {
        const row = getSocialNetworkById(socialNetworks, config.id);

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
      render: (config: BasicServiceItem) => {
        const row = getSocialNetworkById(socialNetworks, config.id);

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
      />
    </Stack>
  );
};

export { MediaSocialNetworksView };
