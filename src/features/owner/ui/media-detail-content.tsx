import {
  Anchor,
  Divider,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  getSocialItems,
  isInternationalMedia,
  isRegionalMedia,
  type AddMediaFormValues,
} from '../model/add-media-form';
import { MediaPackagesView } from './media-packages-view';
import { MediaPricesTableView } from './media-prices-table-view';
import { MediaSocialNetworksView } from './media-social-networks-view';

type MediaDetailContentProps = {
  data: AddMediaFormValues;
  statusLabel: string;
};

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={4}>
    <Text size="xs" tt="uppercase" fw={600} c="dimmed">
      {label}
    </Text>
    <Text size="sm">{value}</Text>
  </Stack>
);

const MediaDetailContent = ({ data, statusLabel }: MediaDetailContentProps) => {
  const locationLabel =
    isRegionalMedia(data.coverage) || isInternationalMedia(data.coverage)
      ? [data.region, data.city].filter(Boolean).join(', ')
      : data.region;
  const socialItems = getSocialItems(data.basicServices);
  const enabledAddons = data.servicePackage.addons.filter(
    (addon) => addon.enabled && addon.name.trim(),
  );

  return (
    <Stack gap="lg">
      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Основная информация</Title>

          <DetailField label="Статус" value={statusLabel} />

          <Stack gap={4}>
            <Text size="xs" tt="uppercase" fw={600} c="dimmed">
              Сайт
            </Text>
            {data.url ? (
              <Anchor href={data.url} target="_blank" rel="noopener noreferrer" size="sm">
                {data.url}
              </Anchor>
            ) : (
              <Text size="sm">Сайт не указан</Text>
            )}
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <DetailField label="Охваты" value={data.trafficReach.trim() || 'Не указаны'} />
            <DetailField label="Тип СМИ" value={data.coverage || 'Не указан'} />
            <DetailField label="Регион / страна" value={locationLabel || 'Не указан'} />
            {isRegionalMedia(data.coverage) || isInternationalMedia(data.coverage) ? (
              <DetailField label="Город" value={data.city.trim() || 'Не указан'} />
            ) : null}
            <DetailField
              label="Темы"
              value={data.themes.length > 0 ? data.themes.join(', ') : 'Не указаны'}
            />
          </SimpleGrid>

          <Stack gap={4}>
            <Text size="xs" tt="uppercase" fw={600} c="dimmed">
              Описание
            </Text>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {data.description.trim() || 'Не указано'}
            </Text>
          </Stack>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Базовые услуги и цены</Title>
          <MediaPricesTableView
            basicServices={data.basicServices}
            agencyDiscount={data.servicePackage.agencyDiscount}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Соцсети</Title>
          <MediaSocialNetworksView
            basicServices={data.basicServices}
            socialNetworks={data.socialNetworks}
            socialItems={socialItems}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Пакеты услуг</Title>
          <MediaPackagesView
            basicServices={data.basicServices}
            servicePackage={data.servicePackage}
          />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Title order={4}>Дополнительные условия</Title>

          {enabledAddons.length === 0 ? (
            <Text c="dimmed" size="sm">
              Дополнительные услуги не указаны.
            </Text>
          ) : (
            <Stack gap="sm">
              {enabledAddons.map((addon) => (
                <Stack key={addon.id} gap={4}>
                  <Text size="sm" fw={500}>
                    {addon.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {Number(addon.price) > 0
                      ? `${Number(addon.price).toLocaleString('ru-RU')} ₽`
                      : 'Цена не указана'}
                  </Text>
                  <Divider />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export { MediaDetailContent };
