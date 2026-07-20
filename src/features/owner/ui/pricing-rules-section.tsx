import { useMemo, type CSSProperties, type ReactNode } from 'react';
import {
  ActionIcon,
  Box,
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
  Tooltip,
} from '@mantine/core';
import { calculateServicePackagePreview, parsePrice } from '@/shared/lib/pricing';
import {
  getBasicServiceSelectOptions,
  type AddMediaFormValues,
} from '../model/add-media-form';
import { getBasicServiceLabelsMap } from '../model/basic-services';
import {
  createPricingAddon,
  createDiscountedServiceItem,
  createServicePackage,
  getDiscountedServiceKeys,
  normalizeServicePackage,
  type DiscountedServiceItem,
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

const BASIC_SERVICES_DISCOUNT_HINT =
  'Сначала отметьте «Скидка» в таблице базовых услуг выше — тогда здесь можно будет выбрать услуги для пакета';

const BASIC_SERVICES_BONUS_HINT =
  'Сначала отметьте «Бонус» в таблице базовых услуг выше — тогда здесь можно будет выбрать услуги для пакета';

const SELECT_BASE_SERVICE_HINT = 'Сначала выберите базовую услугу';

type FieldHintTooltipProps = {
  label: string;
  active: boolean;
  children: ReactNode;
  style?: CSSProperties;
};

const FieldHintTooltip = ({ label, active, children, style }: FieldHintTooltipProps) => {
  const wrapped = <Box style={style}>{children}</Box>;

  if (!active) {
    return wrapped;
  }

  return (
    <Tooltip label={label} multiline w={300} withArrow>
      {wrapped}
    </Tooltip>
  );
};

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

    if (getDiscountedServiceKeys(servicePackage).length === 0) {
      return 'Выберите услуги со скидкой';
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
      {preview.breakdown.map((line, lineIndex) => (
        <Group key={`${line.label}-${lineIndex}`} justify="space-between" wrap="wrap" align="flex-start">
          <Text size="sm" style={{ flex: 1, minWidth: 160 }}>
            {line.label}
          </Text>
          <Text size="sm" fw={500} c={line.amount < 0 ? 'red' : undefined} style={{ flexShrink: 0 }}>
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
  servicePackage: rawServicePackage,
  index,
  basicServices,
  agencyDiscount,
  discountOptions,
  bonusOptions,
  onUpdate,
  onRemove,
}: ServicePackageCardProps) => {
  const servicePackage = normalizeServicePackage(rawServicePackage);

  const handleKindChange = (value: string | null) => {
    const kind = (value ?? 'discount') as ServicePackageKind;
    onUpdate(
      kind === 'discount'
        ? {
            kind,
            discountedServices:
              rawServicePackage.discountedServices?.length > 0
                ? rawServicePackage.discountedServices
                : [createDiscountedServiceItem()],
          }
        : { kind },
    );
  };

  const addDiscountedService = () => {
    onUpdate({
      discountedServices: [
        ...servicePackage.discountedServices,
        createDiscountedServiceItem(),
      ],
    });
  };

  const removeDiscountedService = (itemId: string) => {
    if (servicePackage.discountedServices.length <= 1) {
      return;
    }

    onUpdate({
      discountedServices: servicePackage.discountedServices.filter(
        (item) => item.id !== itemId,
      ),
    });
  };

  const updateDiscountedService = (
    itemId: string,
    patch: Partial<DiscountedServiceItem>,
  ) => {
    onUpdate({
      discountedServices: servicePackage.discountedServices.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    });
  };

  const hasBaseService = servicePackage.baseServiceKeys.length > 0;
  const hasDiscountOptions = discountOptions.length > 0;
  const hasBonusOptions = bonusOptions.length > 0;
  const discountedSectionDisabled = !hasDiscountOptions || !hasBaseService;
  const discountedSectionHint = !hasDiscountOptions
    ? BASIC_SERVICES_DISCOUNT_HINT
    : SELECT_BASE_SERVICE_HINT;
  const discountedPlaceholder = !hasDiscountOptions
    ? 'Отметьте «Скидка» в таблице базовых услуг'
    : hasBaseService
      ? 'Выберите услуги'
      : 'Сначала выберите базовую услугу';

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
            <Group align="flex-start" wrap="nowrap" gap="md">
              <FieldHintTooltip
                label={BASIC_SERVICES_DISCOUNT_HINT}
                active={!hasDiscountOptions}
                style={{ flex: 1, minWidth: 240 }}
              >
                <MultiSelect
                  label="Базовая услуга"
                  data={discountOptions}
                  value={servicePackage.baseServiceKeys}
                  onChange={(value) => {
                    const baseServiceKeys = value as ServicePackage['baseServiceKeys'];

                    onUpdate({
                      baseServiceKeys,
                      discountedServices:
                        baseServiceKeys.length === 0
                          ? servicePackage.discountedServices.map((item) => ({
                              ...item,
                              serviceKeys: [],
                            }))
                          : servicePackage.discountedServices,
                    });
                  }}
                  placeholder={
                    hasDiscountOptions ? 'Выберите услугу' : 'Отметьте «Скидка» в таблице базовых услуг'
                  }
                  disabled={!hasDiscountOptions}
                />
              </FieldHintTooltip>

              <FieldHintTooltip
                label={discountedSectionHint}
                active={discountedSectionDisabled}
                style={{
                  flex: 1,
                  minWidth: 280,
                  opacity: hasBaseService ? 1 : 0.55,
                }}
              >
                <Stack gap="sm">
                  {servicePackage.discountedServices.map((item, itemIndex) => (
                    <Group key={item.id} align="flex-end" wrap="nowrap">
                      <MultiSelect
                        label={itemIndex === 0 ? 'Услуги со скидкой' : undefined}
                        data={discountOptions}
                        value={item.serviceKeys}
                        onChange={(value) =>
                          updateDiscountedService(item.id, {
                            serviceKeys: value as DiscountedServiceItem['serviceKeys'],
                          })
                        }
                        placeholder={discountedPlaceholder}
                        disabled={discountedSectionDisabled}
                        style={{ flex: 1, minWidth: 180 }}
                      />
                      <NumberInput
                        label={itemIndex === 0 ? 'Скидка' : undefined}
                        suffix="%"
                        value={item.percent}
                        onChange={(value) =>
                          updateDiscountedService(item.id, {
                            percent: Number(value) || 0,
                          })
                        }
                        min={0}
                        max={100}
                        w={100}
                        disabled={discountedSectionDisabled}
                      />
                      <Tooltip
                        label={
                          !hasDiscountOptions
                            ? BASIC_SERVICES_DISCOUNT_HINT
                            : !hasBaseService
                              ? SELECT_BASE_SERVICE_HINT
                              : servicePackage.discountedServices.length <= 1
                                ? 'Нельзя удалить последнюю услугу со скидкой'
                                : 'Удалить'
                        }
                        multiline={!hasDiscountOptions || !hasBaseService}
                        w={!hasDiscountOptions || !hasBaseService ? 300 : undefined}
                      >
                        <Box component="span" style={{ display: 'inline-flex' }}>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="lg"
                            aria-label="Удалить услугу со скидкой"
                            disabled={
                              discountedSectionDisabled ||
                              servicePackage.discountedServices.length <= 1
                            }
                            onClick={() => removeDiscountedService(item.id)}
                          >
                            ×
                          </ActionIcon>
                        </Box>
                      </Tooltip>
                    </Group>
                  ))}

                  <Button
                    size="xs"
                    variant="light"
                    onClick={addDiscountedService}
                    disabled={discountedSectionDisabled}
                  >
                    Добавить услугу со скидкой
                  </Button>
                </Stack>
              </FieldHintTooltip>
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="bonus" pt="md">
            <Group align="flex-end" wrap="wrap">
              <FieldHintTooltip
                label={BASIC_SERVICES_BONUS_HINT}
                active={!hasBonusOptions}
                style={{ flex: 1, minWidth: 240 }}
              >
                <MultiSelect
                  label="Услуги для условия"
                  data={bonusOptions}
                  value={servicePackage.serviceKeys}
                  onChange={(value) =>
                    onUpdate({ serviceKeys: value as ServicePackage['serviceKeys'] })
                  }
                  placeholder={
                    hasBonusOptions
                      ? 'Выберите услуги'
                      : 'Отметьте «Бонус» в таблице базовых услуг'
                  }
                  disabled={!hasBonusOptions}
                />
              </FieldHintTooltip>
              <FieldHintTooltip
                label={BASIC_SERVICES_BONUS_HINT}
                active={!hasBonusOptions}
                style={{ flex: 1, minWidth: 240 }}
              >
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
                    hasBonusOptions
                      ? 'Выберите бонусные услуги'
                      : 'Отметьте «Бонус» в таблице базовых услуг'
                  }
                  disabled={!hasBonusOptions}
                />
              </FieldHintTooltip>
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
