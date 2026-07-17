import { Button, Group, Stack, Title } from '@mantine/core';
import { Link, useNavigate } from '@tanstack/react-router';
import { serializeCreateMediaPayload } from '../model/add-media-form';
import { useOwnerMedia } from '../model/owner-media-context';
import { MediaForm } from './media-form';
import { useAddMediaForm } from './use-add-media-form';
import { ROUTES } from '@/shared/model';

const AddMediaPage = () => {
  const navigate = useNavigate();
  const { addMediaItem } = useOwnerMedia();
  const {
    values,
    updateField,
    handleBasicServicesChange,
    handlePricingRulesChange,
  } = useAddMediaForm();

  const handleSubmit = () => {
    const payload = serializeCreateMediaPayload(values);
    console.log('[CreateMedia] payload:', payload);
    addMediaItem(values);
    navigate({ to: ROUTES.OWNER_MEDIA });
  };

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

      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Title order={3}>Добавить СМИ</Title>
      </Group>

      <MediaForm
        values={values}
        onFieldChange={updateField}
        onBasicServicesChange={handleBasicServicesChange}
        onPricingRulesChange={handlePricingRulesChange}
      />

      <Group justify="flex-end">
        <Button component={Link} to={ROUTES.OWNER_MEDIA} variant="default">
          Отмена
        </Button>
        <Button onClick={handleSubmit}>Создать</Button>
      </Group>
    </Stack>
  );
};

export { AddMediaPage };
