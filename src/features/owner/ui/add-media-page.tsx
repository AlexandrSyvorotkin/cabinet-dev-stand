import { useMutation } from '@apollo/client/react';
import { Button, Group, Stack, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { CREATE_MEDIA_PARTNER } from '../api/mutation';
import { toCreateMediaPartnerInput } from '../model/add-media-form';
import { useOwnerMedia } from '../model/owner-media-context';
import { MediaForm } from './media-form';
import { useAddMediaForm } from './use-add-media-form';
import { ROUTES } from '@/shared/model';

const AddMediaPage = () => {
  const { addMediaItem } = useOwnerMedia();
  const { form, setCoverage, setBasicServices, setServicePackage } = useAddMediaForm();
  const [createMediaPartner, { loading }] = useMutation(CREATE_MEDIA_PARTNER);

  const handleSubmit = form.onSubmit(async (values) => {
    console.log(values)
    // const input = toCreateMediaPartnerInput(values);
    
    // console.log('[CreateMedia] input:', input);

    try {
      // const { data } = await createMediaPartner({ variables: { input } });
      // console.log('[CreateMedia] result:', data);
      addMediaItem(values);
      // navigate({ to: ROUTES.OWNER_MEDIA });
    } catch (error) {
      console.error('[CreateMedia] error:', error);
      window.alert('Не удалось создать СМИ. Подробности в консоли.');
    }
  });

  return (
    <form onSubmit={handleSubmit}>
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
          form={form}
          onCoverageChange={setCoverage}
          onBasicServicesChange={setBasicServices}
          onServicePackageChange={setServicePackage}
        />

        <Group justify="flex-end">
          <Button component={Link} to={ROUTES.OWNER_MEDIA} variant="default">
            Отмена
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Создать
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export { AddMediaPage };
