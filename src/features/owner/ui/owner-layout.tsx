import { Outlet } from '@tanstack/react-router';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { OwnerMediaProvider } from '../model/owner-media-context';

const OwnerLayout = () => {
  return (
    <OwnerMediaProvider>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <Title order={2}>Личный кабинет исполнителя</Title>

          <Paper withBorder px="md" py="xs" radius="md">
            <Text size="sm" fw={500}>
              Гонорар: 0 руб.
            </Text>
          </Paper>
        </Group>

        <Outlet />
      </Stack>
    </OwnerMediaProvider>
  );
};

export { OwnerLayout };
