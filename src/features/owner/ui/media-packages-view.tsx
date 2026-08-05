import { useMemo } from 'react';
import { Badge, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { calculateServicePackagePreview, parsePrice } from '@/shared/lib/pricing';
import {
  getBasicServiceLabelsMap,
  type BasicServicesState,
} from '../model/basic-services';
import {
  PACKAGE_KIND_ACCENT,
  PACKAGE_KIND_COLORS,
  PACKAGE_KIND_HEADER_BG,
  PACKAGE_KIND_PANEL_BORDER,
} from '../model/package-kind-theme';
import {
  getServicePackageLabel,
  normalizeServicePackage,
  type PricingRules,
  type ServicePackage,
} from '../model/pricing';

type MediaPackagesViewProps = {
  basicServices: BasicServicesState;
  servicePackage: PricingRules;
};

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const formatServiceList = (keys: string[], serviceLabels: Record<string, string>): string =>
  keys.length > 0 ? keys.map((key) => serviceLabels[key] ?? key).join(', ') : 'Не указаны';

const PackageDetailField = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={4}>
    <Text size="xs" tt="uppercase" fw={600} c="dimmed">
      {label}
    </Text>
    <Text size="sm">{value}</Text>
  </Stack>
);

const MediaPackageCardView = ({
  servicePackage: rawServicePackage,
  index,
  agencyDiscount,
  serviceLabels,
  servicePrices,
}: {
  servicePackage: ServicePackage;
  index: number;
  agencyDiscount: PricingRules['agencyDiscount'];
  serviceLabels: Record<string, string>;
  servicePrices: Record<string, number>;
}) => {
  const servicePackage = normalizeServicePackage(rawServicePackage);
  const preview = useMemo(
    () =>
      calculateServicePackagePreview({
        servicePackage,
        servicePrices,
        serviceLabels,
        agencyDiscount,
      }),
    [servicePackage, servicePrices, serviceLabels, agencyDiscount],
  );

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      bg="gray.0"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: PACKAGE_KIND_ACCENT[servicePackage.kind],
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap">
          <Title order={5}>{getServicePackageLabel(servicePackage, index)}</Title>
          <Badge color={PACKAGE_KIND_COLORS[servicePackage.kind]} variant="light">
            {servicePackage.kind === 'discount' ? 'Скидка' : 'Бонус'}
          </Badge>
        </Group>

        {servicePackage.kind === 'discount' ? (
          <Stack gap="sm">
            <PackageDetailField
              label="Базовая услуга"
              value={formatServiceList(servicePackage.baseServiceKeys, serviceLabels)}
            />

            {servicePackage.discountedServices.map((item, itemIndex) => (
              <PackageDetailField
                key={item.id}
                label={`Услуги со скидкой ${itemIndex + 1}`}
                value={`${formatServiceList(item.serviceKeys, serviceLabels)} (−${item.percent}%)`}
              />
            ))}
          </Stack>
        ) : (
          <Stack gap="sm">
            <PackageDetailField
              label="Услуги для условия"
              value={formatServiceList(servicePackage.serviceKeys, serviceLabels)}
            />
            <PackageDetailField
              label="Бонусные услуги"
              value={formatServiceList(servicePackage.bonusServiceKeys, serviceLabels)}
            />
          </Stack>
        )}

        {preview ? (
          <Paper
            withBorder
            p="sm"
            radius="md"
            style={{
              background: PACKAGE_KIND_HEADER_BG[servicePackage.kind],
              borderColor: PACKAGE_KIND_PANEL_BORDER[servicePackage.kind],
            }}
          >
            <Stack gap="xs">
              <Text size="sm" fw={600} c={PACKAGE_KIND_COLORS[servicePackage.kind]}>
                Расчёт
              </Text>

              {preview.breakdown.map((line, lineIndex) => (
                <Group
                  key={`${line.label}-${lineIndex}`}
                  justify="space-between"
                  wrap="wrap"
                  align="flex-start"
                >
                  <Text size="sm" style={{ flex: 1, minWidth: 160 }}>
                    {line.label}
                  </Text>
                  <Text
                    size="sm"
                    fw={500}
                    c={line.amount < 0 ? 'red' : undefined}
                    style={{ flexShrink: 0 }}
                  >
                    {line.amount < 0 ? '−' : ''}
                    {formatAmount(Math.abs(line.amount))} руб.
                  </Text>
                </Group>
              ))}

              <Divider />

              <Group justify="space-between">
                <Text fw={600} size="sm">
                  Итого
                </Text>
                <Text fw={600} size="sm">
                  {formatAmount(preview.finalPrice)} руб.
                </Text>
              </Group>
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
};

const MediaPackagesView = ({ basicServices, servicePackage }: MediaPackagesViewProps) => {
  const serviceLabels = useMemo(
    () => getBasicServiceLabelsMap(basicServices.items),
    [basicServices.items],
  );

  const servicePrices = useMemo(
    () =>
      Object.fromEntries(
        basicServices.items.map((item) => [item.id, parsePrice(item.price)]),
      ),
    [basicServices.items],
  );

  if (servicePackage.servicePackages.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        Пакеты услуг не настроены.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {servicePackage.servicePackages.map((servicePackageItem, index) => (
        <MediaPackageCardView
          key={servicePackageItem.id}
          servicePackage={servicePackageItem}
          index={index}
          agencyDiscount={servicePackage.agencyDiscount}
          serviceLabels={serviceLabels}
          servicePrices={servicePrices}
        />
      ))}
    </Stack>
  );
};

export { MediaPackagesView };
