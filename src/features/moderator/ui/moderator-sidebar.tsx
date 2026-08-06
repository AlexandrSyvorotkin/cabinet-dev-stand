import { Badge, NavLink, Stack } from '@mantine/core';
import { Link, useRouterState } from '@tanstack/react-router';
import { getSession } from '@/shared/model';
import { getModeratorNavItems } from '../model/moderator-nav';

const ModeratorSidebar = () => {
  const session = getSession();
  const role = session?.user.role;
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (!role) {
    return null;
  }

  const items = getModeratorNavItems(role);

  return (
    <Stack
      component="nav"
      gap={4}
      w={220}
      py="sm"
      px="xs"
      style={{
        flexShrink: 0,
        borderRight: '1px solid var(--mantine-color-gray-3)',
        alignSelf: 'stretch',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.to === '/moderator'
            ? pathname === '/moderator' || pathname === '/moderator/'
            : pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.to}
            component={Link}
            to={item.to}
            label={item.label}
            leftSection={<Icon size={18} weight={isActive ? 'fill' : 'regular'} />}
            rightSection={
              item.badge != null ? (
                <Badge size="sm" variant="filled" circle>
                  {item.badge}
                </Badge>
              ) : undefined
            }
            active={isActive}
            variant="light"
          />
        );
      })}
    </Stack>
  );
};

export { ModeratorSidebar };
