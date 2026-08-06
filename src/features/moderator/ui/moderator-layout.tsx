import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { ModeratorSidebar } from './moderator-sidebar';

const ModeratorLayout = () => {
  return (
    <Group align="stretch" gap={0} wrap="nowrap" mih="calc(100dvh - 56px - var(--mantine-spacing-md) * 2)">
      <ModeratorSidebar />

      <Stack flex={1} gap="lg" pl="lg" miw={0} mih={0}>
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <Title order={2}>Панель модератора</Title>

          <Paper withBorder px="md" py="xs" radius="md">
            <Text size="sm" fw={500}>
              Гонорар: 0 руб.
            </Text>
          </Paper>
        </Group>

        <Outlet />
      </Stack>
    </Group>
  );
};

export { ModeratorLayout };
