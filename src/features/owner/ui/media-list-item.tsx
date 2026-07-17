import { Button, Group, Paper, Stack, Text } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import type { OwnerMediaItem } from '../model/media';
import { MediaPricingSummaryView } from './media-pricing-summary';

type MediaListItemProps = {
  item: OwnerMediaItem;
  index: number;
  onSendToModeration?: (item: OwnerMediaItem) => void;
  onDelete?: (item: OwnerMediaItem) => void;
  canEdit?: boolean;
};

const MediaListItem = ({ item, index, onSendToModeration, onDelete, canEdit }: MediaListItemProps) => {
  const { data } = item;
  const showCreatedActions = item.tab === 'created' && (onSendToModeration || canEdit);
  const showActions = showCreatedActions || Boolean(onDelete);

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={600}>
              СМИ №{index + 1}: {data.name || 'Без названия'}
            </Text>
            <Text size="sm" c="dimmed">
              {data.url || 'Сайт не указан'}
            </Text>
            <Text size="sm">
              {data.trafficReach || 'Охваты не указаны'} · {data.region} · {data.coverage}
            </Text>
            <Text size="sm">
              Статус:{' '}
              <Text span fw={600}>
                {item.statusLabel}
              </Text>
            </Text>
          </Stack>

          {showActions ? (
            <Stack gap="xs" align="stretch">
              {onSendToModeration ? (
                <Button onClick={() => onSendToModeration(item)}>
                  Отправить на модерацию
                </Button>
              ) : null}
              {canEdit ? (
                <Link
                  to="/owner/media/$mediaId/edit"
                  params={{ mediaId: String(item.id) }}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="default" fullWidth>
                    Редактировать
                  </Button>
                </Link>
              ) : null}
              {onDelete ? (
                <Button color="red" variant="light" onClick={() => onDelete(item)}>
                  Удалить
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </Group>

        <MediaPricingSummaryView data={data} />
      </Stack>
    </Paper>
  );
};

export { MediaListItem };
