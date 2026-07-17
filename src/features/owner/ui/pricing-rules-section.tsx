import { useMemo } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { calculateServicePackagePreview, parsePrice } from '@/shared/lib/pricing';
import {
  getBasicServiceSelectOptions,
  type AddMediaFormValues,
} from '../model/add-media-form';
import { getBasicServiceLabelsMap } from '../model/basic-services';
import {
  createPricingAddon,
  createServicePackage,
  type ServicePackage,
  type PricingRules,
  type ServicePackageKind,
  type AgencyDiscount,
} from '../model/pricing';

type PricingRulesBaseProps = {
  rules: PricingRules;
  onRulesChange: (rules: PricingRules) => void;
};

type ServicePackagesSectionProps = PricingRulesBaseProps & {
  basicServices: AddMediaFormValues['basicServices'];
};

type ServicePackageCardProps = {
  servicePackage: ServicePackage;
  index: number;
  basicServices: AddMediaFormValues['basicServices'];
  agencyDiscount: AgencyDiscount;
  discountOptions: { value: string; label: string }[];
  bonusOptions: { value: string; label: string }[];
  onUpdate: (patch: Partial<ServicePackage>) => void;
  onRemove: () => void;
};

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const ServicePackagePreview = ({
  servicePackage,
  basicServices,
  agencyDiscount,
}: {
  servicePackage: ServicePackage;
  basicServices: AddMediaFormValues['basicServices'];
  agencyDiscount: AgencyDiscount;
}) => {
  const servicePrices = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(basicServices.values).map(([key, row]) => [key, parsePrice(row.price)]),
      ),
    [basicServices.values],
  );

  const serviceLabels = useMemo(
    () => getBasicServiceLabelsMap(basicServices.items),
    [basicServices.items],
  );

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

  const pendingHint = useMemo(() => {
    if (servicePackage.kind !== 'discount') {
      return null;
    }

    if (servicePackage.baseServiceKeys.length === 0) {
      return 'Выберите базовую услугу';
    }

    if (servicePackage.serviceKeys.length < servicePackage.minCount) {
      return `Скидка на доп. услуги применится при выборе от ${servicePackage.minCount} услуг`;
    }

    return null;
  }, [servicePackage]);

  if (!preview) {
    return (
      <Text size="sm" c="dimmed">
        {servicePackage.kind === 'discount'
          ? 'Выберите базовую услугу и услуги со скидкой'
          : 'Выберите услуги, чтобы увидеть расчёт'}
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      {preview.breakdown.map((line) => (
        <Group key={line.label} justify="space-between" wrap="nowrap">
          <Text size="sm">{line.label}</Text>
          <Text size="sm" fw={500} c={line.amount < 0 ? 'red' : undefined}>
            {line.amount < 0 ? '−' : ''}
            {formatAmount(Math.abs(line.amount))} руб.
          </Text>
        </Group>
      ))}

      {pendingHint ? (
        <Text size="xs" c="dimmed">
          {pendingHint}
        </Text>
      ) : null}

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
  );
};

const ServicePackageCard = ({
  servicePackage,
  index,
  basicServices,
  agencyDiscount,
  discountOptions,
  bonusOptions,
  onUpdate,
  onRemove,
}: ServicePackageCardProps) => {
  const handleKindChange = (value: string | null) => {
    const kind = (value ?? 'discount') as ServicePackageKind;
    onUpdate({ kind });
  };

  return (
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <TextInput
            label="Название пакета"
            value={servicePackage.name}
            onChange={(event) => onUpdate({ name: event.currentTarget.value })}
            placeholder={`Пакет услуг ${index + 1}`}
            style={{ flex: 1, minWidth: 220 }}
          />
          <Button color="red" variant="subtle" size="xs" onClick={onRemove}>
            Удалить
          </Button>
        </Group>

        <Tabs value={servicePackage.kind} onChange={handleKindChange}>
          <Tabs.List>
            <Tabs.Tab value="discount">Скидка</Tabs.Tab>
            <Tabs.Tab value="bonus">Бонус</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="discount" pt="md">
            <Group align="flex-end" wrap="wrap">
              <NumberInput
                label="Мин. услуг со скидкой"
                value={servicePackage.minCount}
                onChange={(value) => onUpdate({ minCount: Number(value) || 1 })}
                min={1}
                w={160}
              />
              <NumberInput
                label="Скидка"
                suffix="%"
                value={servicePackage.percent}
                onChange={(value) => onUpdate({ percent: Number(value) || 0 })}
                min={0}
                max={100}
                w={120}
              />
              <MultiSelect
                label="Базовая услуга"
                data={discountOptions.filter(
                  (option) => !servicePackage.serviceKeys.includes(option.value),
                )}
                value={servicePackage.baseServiceKeys}
                onChange={(value) => {
                  const baseServiceKeys = value as ServicePackage['baseServiceKeys'];

                  onUpdate({
                    baseServiceKeys,
                    serviceKeys: servicePackage.serviceKeys.filter(
                      (key) => !baseServiceKeys.includes(key),
                    ),
                  });
                }}
                placeholder={
                  discountOptions.length === 0
                    ? 'Отметьте «Скидка» в таблице базовых услуг'
                    : 'Выберите услугу'
                }
                disabled={discountOptions.length === 0}
                style={{ flex: 1, minWidth: 200 }}
              />
              <MultiSelect
                label="Услуги со скидкой"
                data={discountOptions.filter(
                  (option) => !servicePackage.baseServiceKeys.includes(option.value),
                )}
                value={servicePackage.serviceKeys}
                onChange={(value) => {
                  const serviceKeys = value as ServicePackage['serviceKeys'];

                  onUpdate({
                    serviceKeys,
                    baseServiceKeys: servicePackage.baseServiceKeys.filter(
                      (key) => !serviceKeys.includes(key),
                    ),
                  });
                }}
                placeholder={
                  discountOptions.length === 0
                    ? 'Отметьте «Скидка» в таблице базовых услуг'
                    : 'Выберите услуги'
                }
                disabled={discountOptions.length === 0}
                style={{ flex: 1, minWidth: 240 }}
              />
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="bonus" pt="md">
            <Group align="flex-end" wrap="wrap">
              <NumberInput
                label="Мин. услуг"
                value={servicePackage.minCount}
                onChange={(value) => onUpdate({ minCount: Number(value) || 1 })}
                min={1}
                w={120}
              />
              <MultiSelect
                label="Услуги для условия"
                data={bonusOptions}
                value={servicePackage.serviceKeys}
                onChange={(value) =>
                  onUpdate({ serviceKeys: value as ServicePackage['serviceKeys'] })
                }
                placeholder={
                  bonusOptions.length === 0
                    ? 'Отметьте «Бонус» в таблице базовых услуг'
                    : 'Выберите услуги'
                }
                disabled={bonusOptions.length === 0}
                style={{ flex: 1, minWidth: 240 }}
              />
              <MultiSelect
                label="Бонусные услуги"
                data={bonusOptions}
                value={servicePackage.bonusServiceKeys}
                onChange={(value) =>
                  onUpdate({
                    bonusServiceKeys: value as ServicePackage['bonusServiceKeys'],
                  })
                }
                placeholder={
                  bonusOptions.length === 0
                    ? 'Отметьте «Бонус» в таблице базовых услуг'
                    : 'Выберите бонусные услуги'
                }
                disabled={bonusOptions.length === 0}
                style={{ flex: 1, minWidth: 240 }}
              />
            </Group>
          </Tabs.Panel>
        </Tabs>

        {servicePackage.kind === 'discount' ? (
          <Paper withBorder p="sm" radius="md" bg="white">
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                Расчёт
              </Text>
              <ServicePackagePreview
                servicePackage={servicePackage}
                basicServices={basicServices}
                agencyDiscount={agencyDiscount}
              />
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
};

const ServicePackagesSection = ({
  basicServices,
  rules,
  onRulesChange,
}: ServicePackagesSectionProps) => {
  const discountOptions = useMemo(
    () => getBasicServiceSelectOptions(basicServices, 'discount'),
    [basicServices],
  );

  const bonusOptions = useMemo(
    () => getBasicServiceSelectOptions(basicServices, 'bonus'),
    [basicServices],
  );

  const updateRules = (patch: Partial<PricingRules>) => {
    onRulesChange({ ...rules, ...patch });
  };

  const updateServicePackage = (id: string, patch: Partial<ServicePackage>) => {
    updateRules({
      servicePackages: rules.servicePackages.map((servicePackage) =>
        servicePackage.id === id ? { ...servicePackage, ...patch } : servicePackage,
      ),
    });
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Пакеты услуг при заказе нескольких базовых услуг одновременно.
        </Text>
        <Button
          size="xs"
          variant="light"
          onClick={() =>
            updateRules({
              servicePackages: [
                ...rules.servicePackages,
                createServicePackage('discount', rules.servicePackages.length + 1),
              ],
            })
          }
        >
          Добавить пакет услуг
        </Button>
      </Group>

      {rules.servicePackages.length === 0 ? (
        <Text c="dimmed" size="sm">
          Нет пакетов услуг. Добавьте пакет со скидкой или бонусом.
        </Text>
      ) : (
        rules.servicePackages.map((servicePackage, index) => (
          <ServicePackageCard
            key={servicePackage.id}
            servicePackage={servicePackage}
            index={index}
            basicServices={basicServices}
            agencyDiscount={rules.agencyDiscount}
            discountOptions={discountOptions}
            bonusOptions={bonusOptions}
            onUpdate={(patch) => updateServicePackage(servicePackage.id, patch)}
            onRemove={() =>
              updateRules({
                servicePackages: rules.servicePackages.filter(
                  (item) => item.id !== servicePackage.id,
                ),
              })
            }
          />
        ))
      )}
    </Stack>
  );
};

const PricingModifiersSection = ({ rules, onRulesChange }: PricingRulesBaseProps) => {
  const updateRules = (patch: Partial<PricingRules>) => {
    onRulesChange({ ...rules, ...patch });
  };

  return (
    <Stack gap="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={5}>Доп. услуги</Title>
          <Button
            size="xs"
            variant="light"
            onClick={() =>
              updateRules({ addons: [...rules.addons, createPricingAddon()] })
            }
          >
            Добавить
          </Button>
        </Group>

        {rules.addons.length === 0 ? (
          <Text c="dimmed" size="sm">
            Нет дополнительных услуг.
          </Text>
        ) : (
          rules.addons.map((addon) => (
            <Group key={addon.id} align="center" wrap="wrap" gap="md">
              <Checkbox
                aria-label="Включить доп. услугу"
                checked={addon.enabled}
                onChange={(event) =>
                  updateRules({
                    addons: rules.addons.map((item) =>
                      item.id === addon.id
                        ? { ...item, enabled: event.currentTarget.checked }
                        : item,
                    ),
                  })
                }
              />
              <Group align="center" gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 200 }}>
                <Text size="sm" fw={500}>
                  Название
                </Text>
                <TextInput
                  value={addon.name}
                  onChange={(event) =>
                    updateRules({
                      addons: rules.addons.map((item) =>
                        item.id === addon.id
                          ? { ...item, name: event.currentTarget.value }
                          : item,
                      ),
                    })
                  }
                  style={{ flex: 1 }}
                  aria-label="Название"
                />
              </Group>
              <Group align="center" gap="xs" wrap="nowrap">
                <Text size="sm" fw={500}>
                  Цена, руб.
                </Text>
                <NumberInput
                  value={addon.price ? Number(addon.price) : ''}
                  onChange={(value) =>
                    updateRules({
                      addons: rules.addons.map((item) =>
                        item.id === addon.id
                          ? { ...item, price: String(value ?? '') }
                          : item,
                      ),
                    })
                  }
                  min={0}
                  thousandSeparator=" "
                  w={160}
                  aria-label="Цена"
                />
              </Group>
              <Button
                color="red"
                variant="subtle"
                onClick={() =>
                  updateRules({
                    addons: rules.addons.filter((item) => item.id !== addon.id),
                  })
                }
              >
                Удалить
              </Button>
            </Group>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export { PricingModifiersSection, ServicePackagesSection };
