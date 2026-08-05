import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useOwnerMedia } from '../model/owner-media-context';
import { MediaForm } from './media-form';
import { useAddMediaForm } from './use-add-media-form';
import { ROUTES } from '@/shared/model';

const cloneFormValues = <T,>(values: T): T => structuredClone(values);

const EditMediaPage = () => {
  const navigate = useNavigate();
  const { mediaId } = useParams({ strict: false });
  const { mediaItems, updateMediaItem } = useOwnerMedia();

  const mediaItem = mediaItems.find((item) => item.id === Number(mediaId));

  const { form, setCoverage, setBasicServices, setPricingRules } = useAddMediaForm(
    mediaItem ? cloneFormValues(mediaItem.data) : undefined,
  );

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

  if (mediaItem.tab !== 'created') {
    return (
      <Stack gap="md">
        <Text c="dimmed">Редактирование доступно только для созданных СМИ.</Text>
        <Button
          component={Link}
          to={ROUTES.OWNER_MEDIA_DETAIL}
          params={{ mediaId: String(mediaItem.id) }}
          variant="light"
          w="fit-content"
        >
          К карточке СМИ
        </Button>
      </Stack>
    );
  }

  const handleSubmit = form.onSubmit((values) => {
    updateMediaItem(mediaItem.id, values);
    navigate({
      to: ROUTES.OWNER_MEDIA_DETAIL,
      params: { mediaId: String(mediaItem.id) },
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Button
          component={Link}
          to={ROUTES.OWNER_MEDIA_DETAIL}
          params={{ mediaId: String(mediaItem.id) }}
          variant="subtle"
          w="fit-content"
          px={0}
        >
          ← К карточке СМИ
        </Button>

        <Group justify="space-between" align="flex-end" wrap="wrap">
          <Title order={3}>Редактировать СМИ</Title>
        </Group>

        <MediaForm
          form={form}
          onCoverageChange={setCoverage}
          onBasicServicesChange={setBasicServices}
          onPricingRulesChange={setPricingRules}
        />

        <Group justify="flex-end">
          <Button
            component={Link}
            to={ROUTES.OWNER_MEDIA_DETAIL}
            params={{ mediaId: String(mediaItem.id) }}
            variant="default"
          >
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </Group>
      </Stack>
    </form>
  );
};

export { EditMediaPage };
