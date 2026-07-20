import {
  Anchor,
  Badge,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  REWRITE_LEVEL_LABELS,
  type CustomerOrder,
} from '../model/order';
import { CustomerMediaPlacementCard } from './customer-media-placement-card';

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

const CustomerOrderDetails = ({ order }: CustomerOrderDetailsProps) => {
  return (
    <Stack gap="lg">
      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={600} size="sm" tt="uppercase">
            Заказ
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Stack gap={4}>
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                Документ или ссылка
              </Text>
              {order.sourceDocumentName ? (
                <Text size="sm">{order.sourceDocumentName}</Text>
              ) : null}
              <Anchor href={order.sourceLink} target="_blank" rel="noopener noreferrer" size="sm">
                {order.sourceLink}
              </Anchor>
            </Stack>

            <DetailField
              label="Картинки"
              value={order.hasImages ? 'Приложены' : 'Не приложены'}
            />
          </SimpleGrid>

          <Textarea
            label="Описание заказа"
            value={order.description}
            readOnly
            autosize
            minRows={3}
          />

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <DetailField label="Тип размещения" value={order.placementType} />
            <DetailField
              label="Кол-во знаков"
              value={formatAmount(order.characterCount)}
            />
            <DetailField
              label="PR-цена"
              value={`${formatAmount(order.priceAmount)} руб.`}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <DetailField
              label="Реклама"
              value={order.isAdvertising ? 'Да' : 'Нет'}
            />
            <DetailField
              label="ERID / регистрация"
              value={
                order.needsEridRegistration
                  ? order.eridToken
                    ? `Нужна (${order.eridToken})`
                    : 'Нужна'
                  : 'Не требуется'
              }
            />
            {order.regionNote ? (
              <DetailField label="Регион" value={order.regionNote} />
            ) : null}
          </SimpleGrid>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={600} size="sm" tt="uppercase">
            Параметры контента
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <DetailField
              label="Время на размещение"
              value={`${order.placementHours} ч.`}
            />
            <DetailField label="Заголовки" value={order.headlines} />
            <DetailField
              label="Правка текста / рерайт"
              value={`${REWRITE_LEVEL_LABELS[order.rewriteLevel]}, ${order.rewritePercent}%`}
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm" tt="uppercase">
            СМИ
          </Text>
          <Badge variant="light">{order.mediaPlacements.length} издания</Badge>
        </Group>

        {order.mediaPlacements.map((placement) => (
          <CustomerMediaPlacementCard key={placement.id} placement={placement} />
        ))}
      </Stack>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text fw={600} size="sm" tt="uppercase">
            Комментарии
          </Text>

          <Textarea
            label="Комментарий к заказу"
            value={order.comment || '—'}
            readOnly
            autosize
            minRows={2}
          />

          {order.resultLink ? (
            <Stack gap={4}>
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                Ссылка на публикацию
              </Text>
              <Anchor
                href={order.resultLink}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                {order.resultLink}
              </Anchor>
            </Stack>
          ) : (
            <TextInput label="Ссылка" value="" placeholder="Появится после публикации" readOnly />
          )}

          {order.messages.length > 0 ? (
            <>
              <Divider label="Модератор ↔ Заказчик" labelPosition="center" />

              <Stack gap="sm">
                {order.messages.map((message) => (
                  <Paper key={message.id} withBorder p="sm" radius="md" bg="gray.0">
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" fw={600}>
                        {message.author === 'moderator' ? 'Модератор' : 'Заказчик'}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {message.createdAt}
                      </Text>
                    </Group>
                    <Text size="sm">{message.text}</Text>
                  </Paper>
                ))}
              </Stack>
            </>
          ) : null}
        </Stack>
      </Paper>
    </Stack>
  );
};

export { CustomerOrderDetails };
