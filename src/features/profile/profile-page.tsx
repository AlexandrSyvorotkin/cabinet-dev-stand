import { Paper, Stack, Text, Title } from '@mantine/core';
import { getSession, USER_ROLE_LABELS } from '@/shared/model';

const ProfilePage = () => {
  const session = getSession();

  if (!session) {
    return null;
  }

  return (
    <Stack gap="md" maw={480}>
      <Title order={2}>Профиль</Title>
      <Paper withBorder p="lg" radius="md">
        <Stack gap="xs">
          <Text>
            <Text span fw={600}>
              Имя:
            </Text>{' '}
            {session.user.name}
          </Text>
          <Text>
            <Text span fw={600}>
              Email:
            </Text>{' '}
            {session.user.email}
          </Text>
          <Text>
            <Text span fw={600}>
              Роль:
            </Text>{' '}
            {USER_ROLE_LABELS[session.user.role]}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
};

export { ProfilePage };
