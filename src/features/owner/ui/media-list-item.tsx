import { Button, Group, Paper, Stack, Text, UnstyledButton } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import type { OwnerMediaItem } from '../model/media';
import { isInternationalMedia, isRegionalMedia } from '../model/add-media-form';
import { ROUTES } from '@/shared/model';

type MediaListItemProps = {
  item: OwnerMediaItem;
  index: number;
  onSendToModeration?: (item: OwnerMediaItem) => void;
  onDelete?: (item: OwnerMediaItem) => void;
};

const MediaListItem = ({ item, index, onSendToModeration, onDelete }: MediaListItemProps) => {
  const { data } = item;
  const showCreatedActions = item.tab === 'created' && Boolean(onSendToModeration);
  const showActions = showCreatedActions || Boolean(onDelete);

  const locationLabel =
    isRegionalMedia(data.coverage) || isInternationalMedia(data.coverage)
      ? [data.region, data.city].filter(Boolean).join(', ')
      : data.region;

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <UnstyledButton
          component={Link}
          to={ROUTES.OWNER_MEDIA_DETAIL}
          params={{ mediaId: String(item.id) }}
          style={{ flex: 1, textAlign: 'left', cursor: 'pointer' }}
        >
          <Stack gap="xs">
            <Text fw={600}>
              СМИ №{index + 1}: {data.name || 'Без названия'}
            </Text>
            <Text size="sm" c="dimmed">
              {data.url || 'Сайт не указан'}
            </Text>
            <Text size="sm">
              {data.trafficReach || 'Охваты не указаны'} · {locationLabel} · {data.coverage}
            </Text>
            <Text size="sm">
              Статус:{' '}
              <Text span fw={600}>
                {item.statusLabel}
              </Text>
            </Text>
          </Stack>
        </UnstyledButton>

        {showActions ? (
          <Stack gap="xs" align="stretch" onClick={(event) => event.stopPropagation()}>
            {onSendToModeration ? (
              <Button onClick={() => onSendToModeration(item)}>
                Отправить на модерацию
              </Button>
            ) : null}
            {onDelete ? (
              <Button color="red" variant="light" onClick={() => onDelete(item)}>
                Удалить
              </Button>
            ) : null}
          </Stack>
        ) : null}
      </Group>
    </Paper>
  );
};

export { MediaListItem };
