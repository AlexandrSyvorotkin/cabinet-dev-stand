import { Outlet } from '@tanstack/react-router';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { CUSTOMER_BALANCE } from '../model/order';

const formatAmount = (value: number): string => value.toLocaleString('ru-RU');

const CustomerLayout = () => {
  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Title order={2}>Личный кабинет заказчика</Title>

        <Paper withBorder px="md" py="xs" radius="md">
          <Text size="sm" fw={500}>
            Баланс: {formatAmount(CUSTOMER_BALANCE)} руб.
          </Text>
        </Paper>
      </Group>

      <Outlet />
    </Stack>
  );
};

export { CustomerLayout };
