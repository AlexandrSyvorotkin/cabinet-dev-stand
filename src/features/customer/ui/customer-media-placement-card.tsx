import {
  Badge,
  Button,
  Checkbox,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  REFUSAL_REASON_LABELS,
  REWRITE_LEVEL_LABELS,
  type CustomerMediaPlacement,
} from '../model/order';

type CustomerMediaPlacementCardProps = {
  placement: CustomerMediaPlacement;
};

const PLACEMENT_STATUS_CONFIG = {
  pending: { label: 'Ожидает решения', color: 'yellow' as const },
  accepted: { label: 'Принято в работу', color: 'green' as const },
  refused: { label: 'Отказ', color: 'red' as const },
};

const CustomerMediaPlacementCard = ({ placement }: CustomerMediaPlacementCardProps) => {
  const statusConfig = PLACEMENT_STATUS_CONFIG[placement.status];

  return (
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Text fw={600} size="sm">
              {placement.mediaName}
            </Text>
            <Badge color={statusConfig.color} variant="light">
              {statusConfig.label}
            </Badge>
          </Stack>

          {placement.status === 'pending' ? (
            <Group gap="xs">
              <Button size="xs" variant="light" color="green">
                Принять в работу
              </Button>
              <Button size="xs" variant="light" color="red">
                Отказать
              </Button>
            </Group>
          ) : null}
        </Group>

        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
          <Checkbox label="Документ" checked={placement.hasDocument} readOnly />
          <Checkbox label="Описание" checked={placement.hasDescription} readOnly />
          <Checkbox label="Рерайт" checked={placement.rewriteRequired} readOnly />
          <Checkbox label="Реклама" checked={placement.advertisingRequired} readOnly />
        </SimpleGrid>

        <Group gap="xs" wrap="wrap">
          <Badge
            color={placement.eridMarking ? 'blue' : 'gray'}
            variant={placement.eridMarking ? 'filled' : 'light'}
          >
            ERID — маркировка СМИ
          </Badge>
        </Group>

        {placement.status === 'refused' && placement.refusalReason ? (
          <Stack gap={4}>
            <Text size="xs" tt="uppercase" fw={600} c="dimmed">
              Причина отказа
            </Text>
            <Text size="sm" c="red">
              {REFUSAL_REASON_LABELS[placement.refusalReason]}
            </Text>
          </Stack>
        ) : null}

        {placement.status === 'pending' ? (
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Возможные причины отказа: не соответствует тематике, уже была опубликована,
              проблемы с ERID, нужно увеличить время.
            </Text>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
};

export { CustomerMediaPlacementCard };
