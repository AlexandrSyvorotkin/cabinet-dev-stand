import {
  ClipboardText,
  Newspaper,
  Users,
  Warning,
  type Icon,
} from '@phosphor-icons/react';
import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import type { ModeratorStats } from '../mock/dashboard';

type StatCardConfig = {
  label: string;
  value: number;
  hint: string;
  icon: Icon;
  iconColor: string;
};

type StatsCardsProps = {
  stats: ModeratorStats;
};

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards: StatCardConfig[] = [
    {
      label: 'Всего СМИ',
      value: stats.totalMedia,
      hint: `+${stats.mediaTodayDelta} сегодня`,
      icon: Newspaper,
      iconColor: 'blue',
    },
    {
      label: 'Всего заказов',
      value: stats.totalOrders,
      hint: `+${stats.ordersTodayDelta} сегодня`,
      icon: ClipboardText,
      iconColor: 'violet',
    },
    {
      label: 'Новые пользователи',
      value: stats.newUsers,
      hint: 'требуют внимания',
      icon: Users,
      iconColor: 'teal',
    },
    {
      label: 'Отклонено',
      value: stats.rejectedToday,
      hint: 'сегодня',
      icon: Warning,
      iconColor: 'red',
    },
  ];

  return (
    <Group gap="md" grow align="stretch">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Paper key={card.label} withBorder p="md" radius="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  {card.label}
                </Text>
                <Text size="xl" fw={700} lh={1.2}>
                  {card.value.toLocaleString('ru-RU')}
                </Text>
                <Text size="xs" c="dimmed">
                  {card.hint}
                </Text>
              </Stack>

              <ThemeIcon size={40} radius="md" variant="light" color={card.iconColor}>
                <Icon size={22} weight="duotone" />
              </ThemeIcon>
            </Group>
          </Paper>
        );
      })}
    </Group>
  );
};

export { StatsCards };
