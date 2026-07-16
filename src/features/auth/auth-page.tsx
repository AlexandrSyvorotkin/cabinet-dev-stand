import { useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { login } from './lib/login';
import { MOCK_PASSWORD, MOCK_USERS } from './mock/users';
import {
  getDefaultRouteForRole,
  saveAuthSession,
  USER_ROLE_LABELS,
} from '@/shared/model';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const user = login({ email, password });

    if (!user) {
      setError('Неверный email или пароль');
      setIsSubmitting(false);
      return;
    }

    saveAuthSession({
      user,
      accessToken: `mock-token-${user.id}`,
    });

    void navigate({ to: getDefaultRouteForRole(user.role) });
  };

  return (
    <Stack maw={420} mx="auto" mt="xl" gap="md">
      <Title order={2}>Вход в личный кабинет</Title>

      <Paper withBorder p="lg" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="owner@media.ru"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
              autoComplete="username"
            />
            <PasswordInput
              label="Пароль"
              placeholder="1234"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              autoComplete="current-password"
            />

            {error ? (
              <Alert color="red" title="Ошибка входа">
                {error}
              </Alert>
            ) : null}

            <Button type="submit" loading={isSubmitting}>
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>

      <Alert title="Тестовые пользователи" color="blue" variant="light">
        <Stack gap={4}>
          <Text size="sm">Пароль для всех: {MOCK_PASSWORD}</Text>
          {MOCK_USERS.map((user) => (
            <Text key={user.id} size="sm">
              {USER_ROLE_LABELS[user.role]} — {user.email}
            </Text>
          ))}
        </Stack>
      </Alert>
    </Stack>
  );
};

export { AuthPage };
