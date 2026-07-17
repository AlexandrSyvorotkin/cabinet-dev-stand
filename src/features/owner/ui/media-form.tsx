import {
  Checkbox,
  Divider,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import {
  MEDIA_COVERAGE_LEVELS,
  MEDIA_REGIONS,
  type AddMediaFormValues,
} from '../model/add-media-form';
import { getSocialItems } from '../model/basic-services';
import { BasicServicesTable } from './basic-services-table';
import { PricingModifiersSection, ServicePackagesSection } from './pricing-rules-section';
import { SocialNetworksTable } from './social-networks-table';

type MediaFormProps = {
  values: AddMediaFormValues;
  onFieldChange: <K extends keyof AddMediaFormValues>(
    field: K,
    value: AddMediaFormValues[K],
  ) => void;
  onBasicServicesChange: (basicServices: AddMediaFormValues['basicServices']) => void;
  onPricingRulesChange: (pricingRules: AddMediaFormValues['pricingRules']) => void;
};

const MediaForm = ({
  values,
  onFieldChange,
  onBasicServicesChange,
  onPricingRulesChange,
}: MediaFormProps) => {
  return (
    <>
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
                onChange={(event) => onFieldChange('name', event.currentTarget.value)}
                required
              />
              <TextInput
                label="Сайт"
                placeholder="https://example.com"
                value={values.url}
                onChange={(event) => onFieldChange('url', event.currentTarget.value)}
                required
              />
              <TextInput
                label="Охваты"
                placeholder="Например: 50 000 в месяц"
                value={values.trafficReach}
                onChange={(event) => onFieldChange('trafficReach', event.currentTarget.value)}
              />
              <Select
                label="Регион"
                data={MEDIA_REGIONS}
                value={values.region}
                onChange={(value) => onFieldChange('region', value ?? '')}
              />
              <Select
                label="Тип СМИ"
                data={MEDIA_COVERAGE_LEVELS}
                value={values.coverage}
                onChange={(value) => onFieldChange('coverage', value ?? '')}
              />
            </SimpleGrid>
          </Stack>

          <Divider />

          <Stack gap="md">
            <Title order={5}>Базовые услуги</Title>
            <BasicServicesTable
              values={values.basicServices}
              onChange={onBasicServicesChange}
              agencyDiscount={values.pricingRules.agencyDiscount}
              onAgencyDiscountChange={(agencyDiscount) =>
                onPricingRulesChange({
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
                    onFieldChange('socialNetworks', {
                      ...values.socialNetworks,
                      photo: event.currentTarget.checked,
                    })
                  }
                />
                <Checkbox
                  label="Видео"
                  checked={values.socialNetworks.video}
                  onChange={(event) =>
                    onFieldChange('socialNetworks', {
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
              onChange={(socialNetworks) => onFieldChange('socialNetworks', socialNetworks)}
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
            onRulesChange={onPricingRulesChange}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Дополнительные условия</Title>
          <PricingModifiersSection
            rules={values.pricingRules}
            onRulesChange={onPricingRulesChange}
          />
        </Stack>
      </Paper>
    </>
  );
};

export { MediaForm };
