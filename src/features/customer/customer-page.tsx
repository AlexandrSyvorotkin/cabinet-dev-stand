import { Alert, Stack, Text, Title } from '@mantine/core';
import { getSession, USER_ROLE_LABELS } from '@/shared/model';

const CustomerPage = () => {
  const session = getSession();

  return (
    <Stack gap="md">
      <Title order={2}>Кабинет заказчика</Title>
      <Alert color="blue" title="Изолированный раздел">
        Доступен только пользователям с ролью «{USER_ROLE_LABELS.customer}».
      </Alert>
      <Text>Здесь будут заказы, статусы кампаний и документы.</Text>
      {session ? <Text c="dimmed">Вы вошли как {session.user.name}</Text> : null}
    </Stack>
  );
};

export { CustomerPage };
