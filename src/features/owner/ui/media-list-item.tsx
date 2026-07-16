import { Button, Group, Paper, Stack, Text } from '@mantine/core';
import type { OwnerMediaItem } from '../model/media';

type MediaListItemProps = {
  item: OwnerMediaItem;
  index: number;
  onSendToModeration?: (item: OwnerMediaItem) => void;
};

const MediaListItem = ({ item, index, onSendToModeration }: MediaListItemProps) => {
  const { data } = item;

  return (
    <Paper withBorder p="md" radius="md">
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

        {item.tab === 'created' && onSendToModeration ? (
          <Button onClick={() => onSendToModeration(item)}>
            Отправить на модерацию
          </Button>
        ) : null}
      </Group>
    </Paper>
  );
};

export { MediaListItem };
