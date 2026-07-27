import {
  Alert,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
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
  const showRegionalFields = isRegionalMedia(values.coverage);
  const showInternationalFields = isInternationalMedia(values.coverage);
  const showLocationFields = showRegionalFields || showInternationalFields;
  const showRknAlert = hasNonCompliantRknPlatforms(values.socialNetworks.platforms);

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
                label="Тип СМИ"
                data={[...MEDIA_COVERAGE_LEVELS]}
                value={values.coverage}
                onChange={(value) => onFieldChange('coverage', value ?? '')}
              />
              {showLocationFields ? (
                <>
                  {showRegionalFields ? (
                    <Select
                      label="Регион"
                      placeholder="Выберите регион"
                      data={[...MEDIA_REGIONS]}
                      value={values.region || null}
                      onChange={(value) => onFieldChange('region', value ?? '')}
                    />
                  ) : (
                    <Select
                      label="Страна"
                      placeholder="Выберите страну"
                      data={[...MEDIA_CIS_COUNTRIES]}
                      value={values.region || null}
                      onChange={(value) => onFieldChange('region', value ?? '')}
                    />
                  )}
                  <TextInput
                    label="Город"
                    placeholder={showInternationalFields ? 'Например: Астана' : 'Например: Барнаул'}
                    value={values.city}
                    onChange={(event) => onFieldChange('city', event.currentTarget.value)}
                  />
                </>
              ) : null}
            </SimpleGrid>

            <MultiSelect
              label="Тема СМИ"
              placeholder="Выберите темы"
              data={[...MEDIA_THEME_OPTIONS]}
              value={getMediaThemeSelectValue(values.themes)}
              onChange={(selected) =>
                onFieldChange('themes', normalizeMediaThemeSelection(selected, values.themes))
              }
              searchable
              clearable
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
            {showRknAlert ? (
              <Alert color="orange" title="Требуется регистрация в РКН">
                При достижении 10 000 подписчиков необходимо зарегистрироваться в РКН и указать
                номер регистрации. Запись останется неактивной, пока номер не внесён. При
                отсутствии регистрации аккаунт может быть деактивирован.
              </Alert>
            ) : null}
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
