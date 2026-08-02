import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Link, useParams } from '@tanstack/react-router';
import { useOwnerMedia } from '../model/owner-media-context';
import { MediaDetailContent } from './media-detail-content';
import { ROUTES } from '@/shared/model';

const MediaDetailPage = () => {
  const { mediaId } = useParams({ strict: false });
  const { mediaItems } = useOwnerMedia();

  const mediaItem = mediaItems.find((item) => item.id === Number(mediaId));

  if (!mediaItem) {
    return (
      <Stack gap="md">
        <Text c="dimmed">СМИ не найдено.</Text>
        <Button component={Link} to={ROUTES.OWNER_MEDIA} variant="light" w="fit-content">
          К списку СМИ
        </Button>
      </Stack>
    );
  }

  const canEdit = mediaItem.tab === 'created';

  return (
    <Stack gap="lg">
      <Button
        component={Link}
        to={ROUTES.OWNER_MEDIA}
        variant="subtle"
        w="fit-content"
        px={0}
      >
        ← К списку СМИ
      </Button>

      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Title order={3}>{mediaItem.data.name || 'Без названия'}</Title>
        {canEdit ? (
          <Button
            component={Link}
            to={ROUTES.OWNER_MEDIA_EDIT}
            params={{ mediaId: String(mediaItem.id) }}
          >
            Редактировать
          </Button>
        ) : null}
      </Group>

      <MediaDetailContent data={mediaItem.data} statusLabel={mediaItem.statusLabel} />
    </Stack>
  );
};

export { MediaDetailPage };
