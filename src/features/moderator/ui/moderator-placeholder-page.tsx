import { Paper, Stack, Text, Title } from '@mantine/core';

type ModeratorPlaceholderPageProps = {
  title: string;
  description?: string;
};

const ModeratorPlaceholderPage = ({
  title,
  description = 'Раздел в разработке',
}: ModeratorPlaceholderPageProps) => {
  return (
    <Paper withBorder p="xl" radius="md">
      <Stack gap="sm">
        <Title order={3}>{title}</Title>
        <Text c="dimmed">{description}</Text>
      </Stack>
    </Paper>
  );
};

export { ModeratorPlaceholderPage };
