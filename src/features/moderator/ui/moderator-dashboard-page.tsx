import { Stack } from '@mantine/core';
import { MODERATOR_STATS } from '../mock/dashboard';
import { ModerationTableSection } from './moderation-table-section';
import { StatsCards } from './stats-cards';

const ModeratorDashboardPage = () => {
  return (
    <Stack flex={1} gap="lg" mih={0}>
      <StatsCards stats={MODERATOR_STATS} />
      <ModerationTableSection />
    </Stack>
  );
};

export { ModeratorDashboardPage };
