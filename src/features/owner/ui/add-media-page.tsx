import { Button, Checkbox, Divider, Group, Paper, Select, SimpleGrid, Stack, TextInput, Title } from '@mantine/core';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  MEDIA_COVERAGE_LEVELS,
  MEDIA_REGIONS,
} from '../model/add-media-form';
import { getSocialItems } from '../model/basic-services';
import { useOwnerMedia } from '../model/owner-media-context';
import { BasicServicesTable } from './basic-services-table';
import { PricingModifiersSection, ServicePackagesSection } from './pricing-rules-section';
import { SocialNetworksTable } from './social-networks-table';
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

      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>СМИ и форматы</Title>

          <Stack gap="md">
            <Title order={5}>Основная информация</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <TextInput
                label="Название СМИ"
                placeholder="Информационно-аналитический портал"
                value={values.name}
                onChange={(event) => updateField('name', event.currentTarget.value)}
                required
              />
              <TextInput
                label="Сайт"
                placeholder="https://example.com"
                value={values.url}
                onChange={(event) => updateField('url', event.currentTarget.value)}
                required
              />
              <TextInput
                label="Охваты"
                placeholder="Например: 50 000 в месяц"
                value={values.trafficReach}
                onChange={(event) =>
                  updateField('trafficReach', event.currentTarget.value)
                }
              />
              <Select
                label="Регион"
                data={MEDIA_REGIONS}
                value={values.region}
                onChange={(value) => updateField('region', value ?? '')}
              />
              <Select
                label="Тип СМИ"
                data={MEDIA_COVERAGE_LEVELS}
                value={values.coverage}
                onChange={(value) => updateField('coverage', value ?? '')}
              />
            </SimpleGrid>
          </Stack>

          <Divider />

          <Stack gap="md">
            <Title order={5}>Базовые услуги</Title>
            <BasicServicesTable
              values={values.basicServices}
              onChange={handleBasicServicesChange}
              agencyDiscount={values.pricingRules.agencyDiscount}
              onAgencyDiscountChange={(agencyDiscount) =>
                handlePricingRulesChange({
                  ...values.pricingRules,
                  agencyDiscount,
                })
              }
            />
          </Stack>

          <Divider />

          <Stack gap="md">
            <Group justify="space-between" align="center" wrap="wrap">
              <Title order={5}>Соцсети</Title>
              <Group gap="md">
                <Checkbox
                  label="Фото"
                  checked={values.socialNetworks.photo}
                  onChange={(event) =>
                    updateField('socialNetworks', {
                      ...values.socialNetworks,
                      photo: event.currentTarget.checked,
                    })
                  }
                />
                <Checkbox
                  label="Видео"
                  checked={values.socialNetworks.video}
                  onChange={(event) =>
                    updateField('socialNetworks', {
                      ...values.socialNetworks,
                      video: event.currentTarget.checked,
                    })
                  }
                />
              </Group>
            </Group>
            <SocialNetworksTable
              socialItems={getSocialItems(values.basicServices)}
              values={values.socialNetworks}
              onChange={(socialNetworks) => updateField('socialNetworks', socialNetworks)}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>Пакеты услуг</Title>

          <ServicePackagesSection
            basicServices={values.basicServices}
            rules={values.pricingRules}
            onRulesChange={handlePricingRulesChange}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Дополнительные условия</Title>
          <PricingModifiersSection
            rules={values.pricingRules}
            onRulesChange={handlePricingRulesChange}
          />
        </Stack>
      </Paper>

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
