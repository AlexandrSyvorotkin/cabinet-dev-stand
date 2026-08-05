import {
  Alert,
  Divider,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import {
  getMediaThemeSelectValue,
  isInternationalMedia,
  isRegionalMedia,
  MEDIA_CIS_COUNTRIES,
  MEDIA_COVERAGE_LEVELS,
  MEDIA_REGIONS,
  MEDIA_THEME_OPTIONS,
  normalizeMediaThemeSelection,
  type AddMediaFormValues,
} from '../model/add-media-form';
import { BASIC_SERVICES_PACKAGES_SECTION_HINT } from '../model/basic-services-hints';
import { getSocialItems } from '../model/basic-services';
import { hasNonCompliantRknPlatforms } from '../model/social-networks';
import type { AddMediaForm } from './use-add-media-form';
import { BasicServicesTable } from './basic-services-table';
import { PricingModifiersSection, ServicePackagesSection } from './pricing-rules-section';
import { SocialNetworksTable } from './social-networks-table';

type MediaFormProps = {
  form: AddMediaForm;
  onCoverageChange: (coverage: string | null) => void;
  onBasicServicesChange: (basicServices: AddMediaFormValues['basicServices']) => void;
  onServicePackageChange: (servicePackage: AddMediaFormValues['servicePackage']) => void;
};

const MediaForm = ({
  form,
  onCoverageChange,
  onBasicServicesChange,
  onServicePackageChange,
}: MediaFormProps) => {
  const { values } = form;
  const showRegionalFields = isRegionalMedia(values.coverage);
  const showInternationalFields = isInternationalMedia(values.coverage);
  const showLocationFields = showRegionalFields || showInternationalFields;
  const showRknAlert = hasNonCompliantRknPlatforms(values.socialNetworks);

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
                withAsterisk
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Сайт"
                placeholder="https://example.com"
                withAsterisk
                key={form.key('url')}
                {...form.getInputProps('url')}
              />
              <TextInput
                label="Охваты"
                placeholder="Например: 50 000 в месяц"
                key={form.key('trafficReach')}
                {...form.getInputProps('trafficReach')}
              />
              <Select
                label="Тип СМИ"
                data={[...MEDIA_COVERAGE_LEVELS]}
                key={form.key('coverage')}
                {...form.getInputProps('coverage')}
                onChange={onCoverageChange}
              />
              {showLocationFields ? (
                <>
                  {showRegionalFields ? (
                    <Select
                      label="Регион"
                      placeholder="Выберите регион"
                      data={[...MEDIA_REGIONS]}
                      withAsterisk
                      key={form.key('region')}
                      {...form.getInputProps('region')}
                      value={values.region || null}
                      onChange={(value) => form.setFieldValue('region', value ?? '')}
                    />
                  ) : (
                    <Select
                      label="Страна"
                      placeholder="Выберите страну"
                      data={[...MEDIA_CIS_COUNTRIES]}
                      withAsterisk
                      key={form.key('region')}
                      {...form.getInputProps('region')}
                      value={values.region || null}
                      onChange={(value) => form.setFieldValue('region', value ?? '')}
                    />
                  )}
                  <TextInput
                    label="Город"
                    placeholder={showInternationalFields ? 'Например: Астана' : 'Например: Барнаул'}
                    key={form.key('city')}
                    {...form.getInputProps('city')}
                  />
                </>
              ) : null}
            </SimpleGrid>

            <MultiSelect
              label="Тема СМИ"
              placeholder="Выберите темы"
              data={[...MEDIA_THEME_OPTIONS]}
              searchable
              clearable
              key={form.key('themes')}
              value={getMediaThemeSelectValue(values.themes)}
              onChange={(selected) =>
                form.setFieldValue(
                  'themes',
                  normalizeMediaThemeSelection(selected, values.themes),
                )
              }
              error={form.errors.themes}
            />

            <Textarea
              label="Описание"
              placeholder="Кратко опишите СМИ, аудиторию и особенности площадки"
              minRows={4}
              autosize
              key={form.key('description')}
              {...form.getInputProps('description')}
            />
          </Stack>

          <Divider />

          <Stack gap="md">
            <Stack gap={4}>
              <Title order={5}>Базовые услуги</Title>
              <Text size="sm" c="dimmed">
                {BASIC_SERVICES_PACKAGES_SECTION_HINT}
              </Text>
            </Stack>
            <BasicServicesTable
              values={values.basicServices}
              onChange={onBasicServicesChange}
              agencyDiscount={values.servicePackage.agencyDiscount}
              onAgencyDiscountChange={(agencyDiscount) =>
                onServicePackageChange({
                  ...values.servicePackage,
                  agencyDiscount,
                })
              }
            />
          </Stack>

          <Divider />

          <Stack gap="md">
            <Title order={5}>Соцсети</Title>
            {showRknAlert ? (
              <Alert color="orange" title="Требуется регистрация в РКН">
                При достижении 10 000 подписчиков необходимо зарегистрироваться в РКН и указать
                номер регистрации. Запись останется неактивной, пока номер не внесён. При
                отсутствии регистрации аккаунт может быть деактивирован.
              </Alert>
            ) : null}
            <SocialNetworksTable
              socialItems={getSocialItems(values.basicServices)}
              basicServices={values.basicServices}
              onBasicServicesChange={onBasicServicesChange}
              values={values.socialNetworks}
              onChange={(socialNetworks) => form.setFieldValue('socialNetworks', socialNetworks)}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>Пакеты услуг</Title>

          <ServicePackagesSection
            basicServices={values.basicServices}
            rules={values.servicePackage}
            onRulesChange={onServicePackageChange}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Дополнительные условия</Title>
          <PricingModifiersSection
            rules={values.servicePackage}
            onRulesChange={onServicePackageChange}
          />
        </Stack>
      </Paper>
    </>
  );
};

export { MediaForm };
