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

  const {

    values,

    updateField,

    handleBasicServicesChange,

    handlePricingRulesChange,

  } = useAddMediaForm();

  const [createMediaPartner, { loading }] = useMutation(CREATE_MEDIA_PARTNER);



  const handleSubmit = async () => {

    if (!values.name.trim() || !values.url.trim()) {

      window.alert('Заполните название СМИ и сайт.');

      return;

    }



    const input = toCreateMediaPartnerInput(values);

    console.log('[CreateMedia] input:', input);



    try {

      const { data } = await createMediaPartner({ variables: { input } });

      console.log('[CreateMedia] result:', data);

      addMediaItem(values);

      // navigate({ to: ROUTES.OWNER_MEDIA });

    } catch (error) {

      console.error('[CreateMedia] error:', error);

      window.alert('Не удалось создать СМИ. Подробности в консоли.');

    }

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

        <Button onClick={handleSubmit} loading={loading} disabled={loading}>

          Создать

        </Button>

      </Group>

    </Stack>

  );

};



export { AddMediaPage };


