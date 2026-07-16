import type { ReactNode } from 'react';
import { Accordion, Badge, Box, Divider, Group, Paper, Stack, Text } from '@mantine/core';
import {
  formatPrice,
  getMediaPricingSummary,
  type MediaPricingSummary,
  type MediaServicePriceItem,
} from '../model/media-pricing-summary';
import type { AddMediaFormValues } from '../model/add-media-form';

const pluralize = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }

  return many;
};

const getPricingSummaryHint = (summary: MediaPricingSummary): string => {
  const parts: string[] = [];

  if (summary.services.length > 0) {
    parts.push(
      `${summary.services.length} ${pluralize(summary.services.length, 'услуга', 'услуги', 'услуг')}`,
    );
  }

  if (summary.packages.length > 0) {
    parts.push(
      `${summary.packages.length} ${pluralize(summary.packages.length, 'пакет', 'пакета', 'пакетов')}`,
    );
  }

  if (summary.addons.length > 0) {
    parts.push(
      `${summary.addons.length} ${pluralize(summary.addons.length, 'доп. услуга', 'доп. услуги', 'доп. услуг')}`,
    );
  }

  return parts.join(' · ');
};

type MediaPricingSummaryProps = {
  data: AddMediaFormValues;
};

const ServicePriceRow = ({ label, price, group }: MediaServicePriceItem) => (
  <Group justify="space-between" wrap="nowrap" py={6} px={4}>
    <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
      <Box
        w={6}
        h={6}
        style={{
          borderRadius: '50%',
          flexShrink: 0,
          background: group === 'social' ? 'var(--mantine-color-cyan-5)' : 'var(--mantine-color-gray-4)',
        }}
      />
      <Text size="sm" truncate>
        {label}
      </Text>
    </Group>
    <Text size="sm" fw={600} style={{ flexShrink: 0 }}>
      {formatPrice(price)}
    </Text>
  </Group>
);

const PackageSummaryCard = ({
  label,
  kind,
  description,
}: MediaPricingSummary['packages'][number]) => (
  <Stack gap={4} py={6} px={4}>
    <Group gap="xs" wrap="wrap">
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Badge size="sm" variant="light" color={kind === 'discount' ? 'blue' : 'grape'}>
        {kind === 'discount' ? 'Скидка' : 'Бонус'}
      </Badge>
    </Group>
    <Text size="sm" c="dimmed" lh={1.45}>
      {description}
    </Text>
  </Stack>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={0.4}>
    {children}
  </Text>
);

const MediaPricingSummaryView = ({ data }: MediaPricingSummaryProps) => {
  const summary = getMediaPricingSummary(data);
  const placementServices = summary.services.filter((service) => service.group === 'placement');
  const socialServices = summary.services.filter((service) => service.group === 'social');
  const hasPackages = summary.packages.length > 0;
  const hasServices = summary.services.length > 0;
  const hasExtras =
    summary.agencyDiscountPercent != null || summary.addons.length > 0;

  if (!hasServices && !hasPackages && !hasExtras) {
    return null;
  }

  const summaryHint = getPricingSummaryHint(summary);

  return (
    <>
      <Divider />

      <Paper withBorder radius="md" bg="gray.0">
        <Accordion chevronPosition="right" variant="default">
          <Accordion.Item value="pricing">
            <Accordion.Control>
              <Group justify="space-between" align="center" wrap="wrap" gap="xs" pr="xs">
                <Stack gap={2}>
                  <Text size="sm" fw={600}>
                    Цены и пакеты
                  </Text>
                  {summaryHint ? (
                    <Text size="xs" c="dimmed">
                      {summaryHint}
                    </Text>
                  ) : null}
                </Stack>
                {summary.agencyDiscountPercent != null ? (
                  <Badge variant="light" color="teal" size="sm">
                    Агентству −{summary.agencyDiscountPercent}%
                  </Badge>
                ) : null}
              </Group>
            </Accordion.Control>

            <Accordion.Panel>
              <Stack gap="md" pb="md" px="md">
                {hasServices ? (
                  <Stack gap="sm">
                    <SectionTitle>Базовые услуги</SectionTitle>

                    {placementServices.length > 0 ? (
                      <Stack gap={0} px="xs">
                        {placementServices.map((service, index) => (
                          <Box key={`placement-${service.label}`}>
                            <ServicePriceRow {...service} />
                            {index < placementServices.length - 1 ? (
                              <Divider color="gray.3" />
                            ) : null}
                          </Box>
                        ))}
                      </Stack>
                    ) : null}

                    {socialServices.length > 0 ? (
                      <Stack gap={6}>
                        {placementServices.length > 0 ? (
                          <Text size="xs" c="dimmed" px="xs" pt={4}>
                            Соцсети
                          </Text>
                        ) : null}
                        <Stack gap={0} px="xs">
                          {socialServices.map((service, index) => (
                            <Box key={`social-${service.label}`}>
                              <ServicePriceRow {...service} />
                              {index < socialServices.length - 1 ? (
                                <Divider color="gray.3" />
                              ) : null}
                            </Box>
                          ))}
                        </Stack>
                      </Stack>
                    ) : null}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    Цены не указаны
                  </Text>
                )}

                {hasPackages ? (
                  <>
                    {hasServices ? <Divider color="gray.3" /> : null}
                    <Stack gap="sm">
                      <SectionTitle>Пакеты услуг</SectionTitle>
                      <Stack gap={0} px="xs">
                        {summary.packages.map((servicePackage, index) => (
                          <Box key={servicePackage.label}>
                            <PackageSummaryCard {...servicePackage} />
                            {index < summary.packages.length - 1 ? (
                              <Divider color="gray.3" />
                            ) : null}
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </>
                ) : null}

                {!hasPackages && hasServices ? (
                  <>
                    <Divider color="gray.3" />
                    <Text size="sm" c="dimmed">
                      Пакеты не настроены
                    </Text>
                  </>
                ) : null}

                {summary.addons.length > 0 ? (
                  <>
                    <Divider color="gray.3" />
                    <Stack gap="sm">
                      <SectionTitle>Доп. услуги</SectionTitle>
                      <Stack gap={0} px="xs">
                        {summary.addons.map((addon, index) => (
                          <Box key={addon.name}>
                            <Group justify="space-between" wrap="nowrap" py={6} px={4}>
                              <Text size="sm">{addon.name}</Text>
                              <Text size="sm" fw={600}>
                                {formatPrice(addon.price)}
                              </Text>
                            </Group>
                            {index < summary.addons.length - 1 ? (
                              <Divider color="gray.3" />
                            ) : null}
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </>
                ) : null}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Paper>
    </>
  );
};

export { MediaPricingSummaryView };
