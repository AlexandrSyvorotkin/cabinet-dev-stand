import type { ReactNode } from 'react';
import { ArrowRight, ChatCircle, Check, ShieldCheck, X } from '@phosphor-icons/react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  MODERATOR_NEW_USERS,
  MODERATOR_PENDING_ORDERS,
  MODERATOR_REJECTED_ITEMS,
} from '../mock/dashboard';

const formatAmount = (value: number): string => `${value.toLocaleString('ru-RU')} руб.`;

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length < 2) {
    return (parts[0]?.slice(0, 2) ?? '?').toUpperCase();
  }

  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
};

const LatestActivitySection = () => {
  return (
    <Stack gap="md">
      <Title order={4}>Последняя активность</Title>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        <ActivityColumn title="Новые пользователи" footerLabel="Все новые пользователи">
          <Stack gap="sm">
            {MODERATOR_NEW_USERS.map((user) => (
              <Paper key={user.id} withBorder p="sm" radius="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <Avatar radius="xl" color="blue" size="md">
                      {getInitials(user.name)}
                    </Avatar>
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>
                        {user.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.email}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.registeredAt}
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Верифицировать">
                      <ActionIcon variant="light" color="blue" aria-label="Верифицировать">
                        <ShieldCheck size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Отклонить">
                      <ActionIcon variant="light" color="red" aria-label="Отклонить">
                        <X size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </ActivityColumn>

        <ActivityColumn title="Ожидают модерации" footerLabel="Все заказы">
          <Stack gap="sm">
            {MODERATOR_PENDING_ORDERS.map((order) => (
              <Paper key={order.id} withBorder p="sm" radius="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {order.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {order.type}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatAmount(order.amount)} · {order.createdAt}
                    </Text>
                  </Stack>

                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Одобрить">
                      <ActionIcon variant="light" color="green" aria-label="Одобрить">
                        <Check size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Отклонить">
                      <ActionIcon variant="light" color="red" aria-label="Отклонить">
                        <X size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Комментарий">
                      <ActionIcon variant="light" color="gray" aria-label="Комментарий">
                        <ChatCircle size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </ActivityColumn>

        <ActivityColumn title="Недавно отклоненные" footerLabel="Все отклонённые">
          <Stack gap="sm">
            {MODERATOR_REJECTED_ITEMS.map((item) => (
              <Paper key={item.id} withBorder p="sm" radius="md">
                <Stack gap={4}>
                  <Text size="sm" fw={500}>
                    {item.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Причина: {item.reason}
                  </Text>
                  <Group justify="space-between" align="center">
                    <Text size="xs" c="dimmed">
                      {item.rejectedAt}
                    </Text>
                    <Anchor size="xs">Просмотр</Anchor>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </ActivityColumn>
      </SimpleGrid>
    </Stack>
  );
};

type ActivityColumnProps = {
  title: string;
  footerLabel: string;
  children: ReactNode;
};

const ActivityColumn = ({ title, footerLabel, children }: ActivityColumnProps) => (
  <Stack gap="sm">
    <Text fw={600} size="sm">
      {title}
    </Text>
    {children}
    <Button
      variant="subtle"
      size="xs"
      w="fit-content"
      px={0}
      rightSection={<ArrowRight size={14} />}
    >
      {footerLabel}
    </Button>
  </Stack>
);

export { LatestActivitySection };
