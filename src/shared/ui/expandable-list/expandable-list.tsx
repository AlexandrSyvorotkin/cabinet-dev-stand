import { Accordion, Paper, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

type ExpandableListItem = {
  id: string | number;
};

type ExpandableListProps<T extends ExpandableListItem> = {
  items: T[];
  renderControl: (item: T) => ReactNode;
  renderPanel: (item: T) => ReactNode;
  renderSummary?: (item: T) => ReactNode;
  emptyText?: string;
};

const ExpandableList = <T extends ExpandableListItem>({
  items,
  renderControl,
  renderPanel,
  renderSummary,
  emptyText = 'Нет данных для отображения',
}: ExpandableListProps<T>) => {
  if (items.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md">
        <Text c="dimmed" ta="center">
          {emptyText}
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="sm">
      {items.map((item) => {
        const summary = renderSummary?.(item);

        return (
          <Paper key={item.id} withBorder radius="md">
            <Accordion chevronPosition="left" variant="default">
              <Accordion.Item value={String(item.id)}>
                <Accordion.Control>{renderControl(item)}</Accordion.Control>
                <Accordion.Panel>{renderPanel(item)}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            {summary ? (
              <Paper px="md" py="sm" radius={0} bg="gray.0">
                {summary}
              </Paper>
            ) : null}
          </Paper>
        );
      })}
    </Stack>
  );
};

export { ExpandableList };
export type { ExpandableListItem, ExpandableListProps };
