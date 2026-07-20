import { AppShell, Avatar, Button, Group, Stack, Text } from '@mantine/core';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { AppContainer } from '@/shared/ui/app-container';
import {
  getSession,
  logout,
  ROUTES,
  USER_ROLES,
  type UserRole,
} from '@/shared/model';

type NavItem = {
  label: string;
  to: string;
  roles: UserRole[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Заказы',
    to: ROUTES.OWNER,
    roles: [USER_ROLES.OWNER],
  },
  {
    label: 'Ваши СМИ',
    to: ROUTES.OWNER_MEDIA,
    roles: [USER_ROLES.OWNER],
  },
  {
    label: 'Заказы',
    to: ROUTES.CUSTOMER,
    roles: [USER_ROLES.CUSTOMER],
  },
  {
    label: 'Кабинет модератора',
    to: ROUTES.MODERATOR,
    roles: [USER_ROLES.MODERATOR],
  },
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
};

const AppLayout = () => {
  const navigate = useNavigate();
  const session = getSession();
  const role = session?.user.role;

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => role && item.roles.includes(role),
  );

  const handleLogout = () => {
    logout();
    void navigate({ to: ROUTES.AUTH });
  };

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            {visibleNavItems.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                variant="subtle"
              >
                {item.label}
              </Button>
            ))}
          </Group>

          <Group gap="sm" wrap="nowrap">
            {session ? (
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  component={Link}
                  to={ROUTES.PROFILE}
                  radius="xl"
                  color="blue"
                  aria-label="Профиль"
                  title="Профиль"
                  style={{ cursor: 'pointer' }}
                >
                  {getInitials(session.user.name)}
                </Avatar>
                <Stack gap={0} visibleFrom="sm">
                  <Text size="sm" fw={500}>
                    {session.user.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {session.user.email}
                  </Text>
                </Stack>
              </Group>
            ) : null}
            <Button variant="light" color="red" onClick={handleLogout}>
              Выход
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <AppContainer>
          <Outlet />
        </AppContainer>
      </AppShell.Main>
    </AppShell>
  );
};

export { AppLayout };
