import { useState } from 'react';
import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { Link } from '@tanstack/react-router';
import {
  OWNER_MEDIA_TABS,
  type OwnerMediaItem,
  type OwnerMediaTabValue,
} from '../model/media';
import { useOwnerMedia } from '../model/owner-media-context';
import { MediaListItem } from './media-list-item';
import { ROUTES } from '@/shared/model';

const OwnerMediaPage = () => {
  const [activeTab, setActiveTab] = useState<OwnerMediaTabValue>('created');
  const { mediaItems, countsByTab, sendToModeration, deleteMediaItem } = useOwnerMedia();

  const handleSendToModeration = (item: OwnerMediaItem) => {
    sendToModeration(item);
    setActiveTab('moderation');
  };

  const handleDelete = (item: OwnerMediaItem) => {
    const name = item.data.name || 'Без названия';

    if (window.confirm(`Удалить СМИ «${name}»? Это действие нельзя отменить.`)) {
      deleteMediaItem(item.id);
    }
  };

  return (
    <Stack gap="lg">
      <Button
        component={Link}
        to={ROUTES.OWNER}
        variant="subtle"
        w="fit-content"
        px={0}
      >
        ← К заказам
      </Button>

      <Group justify="space-between" align="center" wrap="wrap">
        <Title order={3}>Ваши СМИ</Title>
        <Button component={Link} to={ROUTES.OWNER_MEDIA_NEW}>
          Добавить СМИ
        </Button>
      </Group>

      <Group justify="space-between" align="center" wrap="wrap">
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab((value as OwnerMediaTabValue) ?? 'created')}
          style={{ flex: 1, minWidth: 280 }}
        >
          <Tabs.List>
            {OWNER_MEDIA_TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                rightSection={
                  <Badge size="sm" color={tab.color} variant="filled" circle>
                    {countsByTab[tab.value]}
                  </Badge>
                }
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {OWNER_MEDIA_TABS.map((tab) => {
            const items = mediaItems.filter((item) => item.tab === tab.value);

            return (
              <Tabs.Panel key={tab.value} value={tab.value} pt="md">
                {items.length === 0 ? (
                  <Paper withBorder p="xl" radius="md">
                    <Text c="dimmed" ta="center">
                      {tab.emptyText}
                    </Text>
                  </Paper>
                ) : (
                  <Stack gap="md">
                    {items.map((item, index) => (
                      <MediaListItem
                        key={item.id}
                        item={item}
                        index={index}
                        onSendToModeration={
                          tab.value === 'created' ? handleSendToModeration : undefined
                        }
                        onDelete={handleDelete}
                        canEdit={tab.value === 'created'}
                      />
                    ))}
                  </Stack>
                )}
              </Tabs.Panel>
            );
          })}
        </Tabs>

        
      </Group>
    </Stack>
  );
};

export { OwnerMediaPage };
