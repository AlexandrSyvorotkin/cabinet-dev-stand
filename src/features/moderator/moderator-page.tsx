import { Alert, Stack, Text, Title } from '@mantine/core';
import { getSession, USER_ROLE_LABELS } from '@/shared/model';

const ModeratorPage = () => {
  const session = getSession();

  return (
    <Stack gap="md">
      <Title order={2}>Кабинет модератора</Title>
      <Alert color="orange" title="Изолированный раздел">
        Доступен только пользователям с ролью «{USER_ROLE_LABELS.moderator}».
      </Alert>
      <Text>Здесь будут очереди модерации и проверка материалов.</Text>
      {session ? <Text c="dimmed">Вы вошли как {session.user.name}</Text> : null}
    </Stack>
  );
};

export { ModeratorPage };
