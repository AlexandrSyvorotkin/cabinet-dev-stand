import { useMemo, useState } from 'react';
import { ChatCircle } from '@phosphor-icons/react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { MEDIA_REGIONS } from '@/features/owner/model/add-media-form';
import {
  MODERATOR_MEDIA_ROWS,
  type ModeratorMediaRow,
} from '../mock/dashboard';
import {
  MODERATION_STATUS_COLORS,
  MODERATION_STATUS_LABELS,
  type ModerationStatus,
} from '../model/moderation-status';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: MODERATION_STATUS_LABELS.new },
  { value: 'moderation', label: MODERATION_STATUS_LABELS.moderation },
  { value: 'rejected', label: MODERATION_STATUS_LABELS.rejected },
];

const PAGE_SIZE = 5;

const ModerationTableSection = () => {
  const [activeTab, setActiveTab] = useState<string | null>('media');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>('all');
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return MODERATOR_MEDIA_ROWS.filter((row) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        row.name.toLowerCase().includes(normalizedQuery) ||
        row.url.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        !statusFilter || statusFilter === 'all' || row.status === statusFilter;
      const matchesRegion = !regionFilter || row.region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [searchQuery, statusFilter, regionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (updater: () => void) => {
    updater();
    setPage(1);
  };

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      flex={1}
      style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
      >
        <Tabs.List>
          <Tabs.Tab value="media">СМИ</Tabs.Tab>
          <Tabs.Tab value="orders">Заказы</Tabs.Tab>
          <Tabs.Tab value="users">Пользователи</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          value="media"
          pt="md"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <Stack gap="md" flex={1} mih={0}>
            <Group align="flex-end" wrap="wrap">
              <TextInput
                label="Поиск"
                placeholder="Поиск по названию СМИ..."
                value={searchQuery}
                onChange={(event) =>
                  handleFilterChange(() => setSearchQuery(event.currentTarget.value))
                }
                style={{ flex: 1, minWidth: 220 }}
              />
              <Select
                label="Статус"
                data={STATUS_FILTER_OPTIONS}
                value={statusFilter}
                onChange={(value) =>
                  handleFilterChange(() => setStatusFilter(value ?? 'all'))
                }
                w={180}
              />
              <Select
                label="Регион"
                placeholder="Все регионы"
                data={[...MEDIA_REGIONS]}
                value={regionFilter}
                onChange={(value) => handleFilterChange(() => setRegionFilter(value))}
                clearable
                searchable
                w={200}
              />
              <Button variant="light">Фильтры</Button>
            </Group>

            <ScrollArea flex={1} type="auto" offsetScrollbars>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Название СМИ</Table.Th>
                    <Table.Th>Регион</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th>Дата регистрации</Table.Th>
                    <Table.Th ta="right">Действия</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedRows.map((row) => (
                    <MediaTableRow key={row.id} row={row} />
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Group justify="space-between" align="center" wrap="wrap">
              <Text size="sm" c="dimmed">
                Показано {(page - 1) * PAGE_SIZE + 1}-
                {Math.min(page * PAGE_SIZE, filteredRows.length)} из {filteredRows.length} СМИ
              </Text>
              <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="orders" pt="md" style={{ flex: 1 }}>
          <Text c="dimmed" ta="center" py="xl">
            Таблица заказов будет здесь
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="users" pt="md" style={{ flex: 1 }}>
          <Text c="dimmed" ta="center" py="xl">
            Таблица пользователей будет здесь
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

const MediaTableRow = ({ row }: { row: ModeratorMediaRow }) => (
  <Table.Tr>
    <Table.Td>
      <Stack gap={2}>
        <Text size="sm" fw={500}>
          {row.name}
        </Text>
        <Text size="xs" c="dimmed">
          {row.url}
        </Text>
      </Stack>
    </Table.Td>
    <Table.Td>
      <Text size="sm">{row.region}</Text>
    </Table.Td>
    <Table.Td>
      <StatusBadge status={row.status} />
    </Table.Td>
    <Table.Td>
      <Text size="sm">{row.registeredAt}</Text>
    </Table.Td>
    <Table.Td>
      <Group gap="xs" justify="flex-end" wrap="nowrap">
        <Button size="xs" color="green" variant="light">
          Одобрить
        </Button>
        <Button size="xs" color="red" variant="light">
          Отклонить
        </Button>
        <Tooltip label="Комментарий">
          <ActionIcon variant="subtle" color="gray" aria-label="Комментарий">
            <ChatCircle size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Table.Td>
  </Table.Tr>
);

const StatusBadge = ({ status }: { status: ModerationStatus }) => (
  <Badge color={MODERATION_STATUS_COLORS[status]} variant="light">
    {MODERATION_STATUS_LABELS[status]}
  </Badge>
);

export { ModerationTableSection };
