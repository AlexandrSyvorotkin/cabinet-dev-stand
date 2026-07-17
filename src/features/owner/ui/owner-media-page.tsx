import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { MEDIA_REGIONS } from '../model/add-media-form';
import {
  OWNER_MEDIA_TABS,
  type OwnerMediaItem,
  type OwnerMediaTabValue,
} from '../model/media';
import { useOwnerMedia } from '../model/owner-media-context';
import { MediaListItem } from './media-list-item';
import { ROUTES } from '@/shared/model';

const filterMediaItems = (
  items: OwnerMediaItem[],
  nameQuery: string,
  regionFilter: string | null,
): OwnerMediaItem[] => {
  const normalizedQuery = nameQuery.trim().toLowerCase();

  return items.filter((item) => {
    const matchesName =
      normalizedQuery.length === 0 ||
      item.data.name.toLowerCase().includes(normalizedQuery);
    const matchesRegion = !regionFilter || item.data.region === regionFilter;

    return matchesName && matchesRegion;
  });
};

const OwnerMediaPage = () => {
  const [activeTab, setActiveTab] = useState<OwnerMediaTabValue>('created');
  const [nameQuery, setNameQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const { mediaItems, countsByTab, sendToModeration, deleteMediaItem } = useOwnerMedia();

  const regionOptions = useMemo(() => {
    const regions = new Set([...MEDIA_REGIONS, ...mediaItems.map((item) => item.data.region)]);

    return [...regions]
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right, 'ru'));
  }, [mediaItems]);

  const hasActiveFilters = nameQuery.trim().length > 0 || regionFilter != null;

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
            const filteredItems = filterMediaItems(items, nameQuery, regionFilter);

            return (
              <Tabs.Panel key={tab.value} value={tab.value} pt="md">
                <Stack gap="md">
                  <Paper withBorder p="md" radius="md">
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <TextInput
                        label="Название СМИ"
                        placeholder="Поиск по названию"
                        value={nameQuery}
                        onChange={(event) => setNameQuery(event.currentTarget.value)}
                      />
                      <Select
                        label="Регион"
                        placeholder="Все регионы"
                        data={regionOptions}
                        value={regionFilter}
                        onChange={setRegionFilter}
                        clearable
                      />
                    </SimpleGrid>
                  </Paper>

                  {items.length === 0 ? (
                    <Paper withBorder p="xl" radius="md">
                      <Text c="dimmed" ta="center">
                        {tab.emptyText}
                      </Text>
                    </Paper>
                  ) : filteredItems.length === 0 ? (
                    <Paper withBorder p="xl" radius="md">
                      <Text c="dimmed" ta="center">
                        {hasActiveFilters
                          ? 'По выбранным фильтрам ничего не найдено.'
                          : tab.emptyText}
                      </Text>
                    </Paper>
                  ) : (
                    <Stack gap="md">
                      {filteredItems.map((item, index) => (
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
                </Stack>
              </Tabs.Panel>
            );
          })}
        </Tabs>

        
      </Group>
    </Stack>
  );
};

export { OwnerMediaPage };
