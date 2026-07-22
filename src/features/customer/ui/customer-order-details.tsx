import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { formatYesNo, type CustomerOrder } from '../model/order';

type CustomerOrderDetailsProps = {
  order: CustomerOrder;
};

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <Stack gap={4}>
    <Text size="xs" tt="uppercase" fw={600} c="dimmed">
      {label}
    </Text>
    <Text size="sm">{value}</Text>
  </Stack>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const CustomerOrderDetails = ({ order }: CustomerOrderDetailsProps) => {
  const canEdit = order.tab === 'in-progress';

  return (
    <Stack gap="md">
      {canEdit ? (
        <Group justify="flex-end">
          <Link
            to="/customer/orders/$orderId/edit"
            params={{ orderId: String(order.id) }}
            style={{ textDecoration: 'none' }}
          >
            <Button variant="light">Редактировать</Button>
          </Link>
        </Group>
      ) : null}

      {order.formData.description ? (
        <DetailField label="Описание заказа" value={order.formData.description} />
      ) : null}

      <Stack gap={4}>
        <Text size="xs" tt="uppercase" fw={600} c="dimmed">
          {order.formData.materialSource === 'link' ? 'Оригинал новости' : 'Материал'}
        </Text>
        {order.formData.materialSource === 'link' ? (
          <Anchor href={order.newsUrl} target="_blank" rel="noopener noreferrer" size="sm">
            {order.newsUrl}
          </Anchor>
        ) : (
          <Text size="sm">{order.newsUrl}</Text>
        )}
      </Stack>

      <DetailField label="Ключевые слова для заголовка" value={order.keywords} />

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <DetailField label="Тип рерайта" value={order.rewriteType} />
        <DetailField label="Ссылка на источник" value={formatYesNo(order.hasSourceLink)} />
        <DetailField
          label="Подпись «на правах рекламы»"
          value={formatYesNo(order.hasAdSignature)}
        />
      </SimpleGrid>

      <DetailField
        label="Возможна полная перепечатка"
        value={formatYesNo(order.canFullReprint)}
      />
      <DetailField label="Тип размещения" value={order.placementType} />

      <Divider />

      <Text size="xs" tt="uppercase" fw={600} c="dimmed">
        Размещено в:
      </Text>

      <Stack gap="sm">
        {order.placedMedia.length === 0 ? (
          <Text size="sm" c="dimmed">
            Пока нет назначенных СМИ.
          </Text>
        ) : null}
        {order.placedMedia.map((media) => (
          <Group key={media.id} justify="space-between" align="center" wrap="wrap">
            <Group gap="xs" wrap="nowrap">
              <Text size="sm" td="underline" c="dimmed">
                {media.mediaName}
              </Text>
              {media.showGoogleIcon ? <GoogleIcon /> : null}
            </Group>
            <Text size="sm" c="red">
              {media.statusLabel}
            </Text>
          </Group>
        ))}
      </Stack>

      <Paper withBorder p="md" radius="md" bg="gray.0">
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <DetailField
              label="Внесённая сумма"
              value={`${formatAmount(order.depositedAmount)} руб.`}
            />
            <DetailField
              label="Возвращённая сумма"
              value={`${formatAmount(order.returnedAmount)} руб.`}
            />
            <DetailField
              label="Списано исполнителям"
              value={`${formatAmount(order.deductedAmount)} руб.`}
            />
          </SimpleGrid>

          <Text size="sm" c="dimmed">
            Неизрасходованные средства возвращены на ваш баланс.
          </Text>

          <Button w={{ base: '100%', sm: 'auto' }}>Скачать отчёт</Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export { CustomerOrderDetails };
