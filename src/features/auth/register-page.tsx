import { useState } from 'react';
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Link, useNavigate } from '@tanstack/react-router';
import { register } from './lib/register';
import {
  createEmptyRegisterForm,
  hasRegisterFormErrors,
  REGISTER_ROLE_LABELS,
  REGISTER_ROLES,
  type RegisterFormErrors,
  type RegisterFormValues,
  type RegisterRole,
  validateRegisterForm,
} from './model/register-form';
import { getDefaultRouteForRole, ROUTES, saveAuthSession } from '@/shared/model';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<RegisterRole>(REGISTER_ROLES.CUSTOMER);
  const [values, setValues] = useState(createEmptyRegisterForm);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleRoleChange = (nextRole: RegisterRole) => {
    setRole(nextRole);
    setErrors({});
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    const nextErrors = validateRegisterForm(values, role);
    setErrors(nextErrors);

    if (hasRegisterFormErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    const result = register({ role, values });

    if (!result.success) {
      setSubmitError(result.message);
      setIsSubmitting(false);
      return;
    }

    if (result.user) {
      saveAuthSession({
        user: result.user,
        accessToken: `mock-token-${result.user.id}`,
      });

      void navigate({ to: getDefaultRouteForRole(result.user.role) });
      return;
    }

    setSuccessMessage(result.message);
    setIsSubmitting(false);
  };

  const getFieldError = (field: keyof RegisterFormValues): string | undefined => {
    return errors[field];
  };

  return (
    <Stack maw={720} mx="auto" mt="xl" gap="md">
      <Title order={2}>Регистрация</Title>

      <Paper withBorder p="lg" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Stack gap="xs">
              <Text size="sm" fw={600} tt="uppercase">
                Зарегистрироваться как:
              </Text>
              <Radio.Group
                value={role}
                onChange={(value) => handleRoleChange(value as RegisterRole)}
              >
                <Group gap="xl">
                  {Object.entries(REGISTER_ROLE_LABELS).map(([value, label]) => (
                    <Radio key={value} value={value} label={label} />
                  ))}
                </Group>
              </Radio.Group>
            </Stack>

            <TextInput
              label="Никнейм/ Nickname"
              placeholder="Введите никнейм"
              value={values.nickname}
              onChange={(event) => updateField('nickname', event.currentTarget.value)}
              error={getFieldError('nickname')}
              required
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Электронная почта"
                placeholder="example@company.ru"
                value={values.email}
                onChange={(event) => updateField('email', event.currentTarget.value)}
                error={getFieldError('email')}
                required
                autoComplete="email"
              />
              <TextInput
                label="Телефон"
                placeholder="+7 (999) 000-00-00"
                value={values.phone}
                onChange={(event) => updateField('phone', event.currentTarget.value)}
                error={getFieldError('phone')}
                required
                autoComplete="tel"
              />
            </SimpleGrid>

            {role === REGISTER_ROLES.CUSTOMER ? (
              <Stack gap="md">
                <TextInput
                  label="Название компании/агентства или частный заказчик?"
                  placeholder="Введите название"
                  value={values.companyName}
                  onChange={(event) => updateField('companyName', event.currentTarget.value)}
                />
                <TextInput
                  label="Ваш стаж работы в PR-индустрии?"
                  placeholder="Например: 5 лет"
                  value={values.prExperience}
                  onChange={(event) => updateField('prExperience', event.currentTarget.value)}
                />
                <Stack gap={4}>
                  <TextInput
                    label="С какими направлениями вы работаете?"
                    placeholder="Укажите направления"
                    value={values.workDirections}
                    onChange={(event) =>
                      updateField('workDirections', event.currentTarget.value)
                    }
                  />
                  <Text size="xs" c="dimmed">
                    (общественно-политическое, социальное, отраслевое, lifestyle и др.)
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <TextInput
                    label="Как часто Вы проводите информационную кампанию в СМИ?"
                    placeholder="Укажите частоту"
                    value={values.campaignFrequency}
                    onChange={(event) =>
                      updateField('campaignFrequency', event.currentTarget.value)
                    }
                  />
                  <Text size="xs" c="dimmed">
                    (регулярно, несколько раз в месяц, несколько раз в неделю, разовый запрос)
                  </Text>
                </Stack>
                <TextInput
                  label="Откуда узнали о нашей системе?"
                  placeholder="Укажите источник"
                  value={values.referralSource}
                  onChange={(event) =>
                    updateField('referralSource', event.currentTarget.value)
                  }
                />
              </Stack>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Название СМИ"
                  placeholder="Информационно-аналитический портал"
                  value={values.mediaName}
                  onChange={(event) => updateField('mediaName', event.currentTarget.value)}
                  error={getFieldError('mediaName')}
                  required
                />
                <TextInput
                  label="Ссылка"
                  placeholder="https://example.com"
                  value={values.mediaUrl}
                  onChange={(event) => updateField('mediaUrl', event.currentTarget.value)}
                  error={getFieldError('mediaUrl')}
                  required
                />
              </SimpleGrid>
            )}

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <PasswordInput
                label="Пароль"
                placeholder="Введите пароль"
                value={values.password}
                onChange={(event) => updateField('password', event.currentTarget.value)}
                error={getFieldError('password')}
                required
                autoComplete="new-password"
              />
              <PasswordInput
                label="Повторите пароль"
                placeholder="Повторите пароль"
                value={values.confirmPassword}
                onChange={(event) =>
                  updateField('confirmPassword', event.currentTarget.value)
                }
                error={getFieldError('confirmPassword')}
                required
                autoComplete="new-password"
              />
            </SimpleGrid>

            <Text size="xs" c="dimmed">
              * поля, обязательные для заполнения
            </Text>

            {submitError ? (
              <Alert color="red" title="Ошибка регистрации">
                {submitError}
              </Alert>
            ) : null}

            {successMessage ? (
              <Alert color="green" title="Регистрация успешна">
                {successMessage}
              </Alert>
            ) : null}

            <Group align="flex-start" wrap="wrap" gap="md">
              <Button type="submit" loading={isSubmitting}>
                Зарегистрироваться
              </Button>
              <Checkbox
                checked={values.termsAccepted}
                onChange={(event) =>
                  updateField('termsAccepted', event.currentTarget.checked)
                }
                error={getFieldError('termsAccepted')}
                label={
                  <Text size="sm">
                    С{' '}
                    <Anchor href="#" underline="always">
                      условиями
                    </Anchor>{' '}
                    ознакомлен(а)
                  </Text>
                }
              />
            </Group>
          </Stack>
        </form>
      </Paper>

      <Text size="sm">
        Уже есть аккаунт?{' '}
        <Anchor component={Link} to={ROUTES.AUTH}>
          Войти
        </Anchor>
      </Text>
    </Stack>
  );
};

export { RegisterPage };
