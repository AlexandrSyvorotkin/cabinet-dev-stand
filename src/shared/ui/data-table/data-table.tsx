import { Fragment, type ReactNode } from 'react';
import { ActionIcon, Center, Table, Text } from '@mantine/core';

type DataTableColumn<T> = {
  key: string;
  title: ReactNode;
  render: (row: T) => ReactNode;
};

type DataTableSection<T> = {
  key: string;
  title?: string;
  rows: T[];
  onAdd?: () => void;
  addAriaLabel?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  sections: DataTableSection<T>[];
  getRowKey: (row: T) => string | number;
  footer?: ReactNode;
};

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path
      d="M7 2.5v9M2.5 7h9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const DataTable = <T,>({
  columns,
  sections,
  getRowKey,
  footer,
}: DataTableProps<T>) => {
  return (
    <Table withTableBorder withColumnBorders striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {columns.map((column) => (
            <Table.Th key={column.key}>{column.title}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {sections.map((section) => (
          <Fragment key={section.key}>
            {section.title ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text fw={600} size="sm">
                    {section.title}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}

            {section.rows.map((row) => (
              <Table.Tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <Table.Td key={column.key}>{column.render(row)}</Table.Td>
                ))}
              </Table.Tr>
            ))}

            {section.onAdd ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} p={6} bg="gray.0">
                  <Center>
                    <ActionIcon
                      variant="light"
                      size="md"
                      radius="xl"
                      onClick={section.onAdd}
                      aria-label={section.addAriaLabel ?? 'Добавить'}
                    >
                      <PlusIcon />
                    </ActionIcon>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : null}
          </Fragment>
        ))}

        {footer ? (
          <Table.Tr>
            <Table.Td colSpan={columns.length} p="md" bg="gray.0">
              {footer}
            </Table.Td>
          </Table.Tr>
        ) : null}
      </Table.Tbody>
    </Table>
  );
};

export { DataTable };
export type { DataTableColumn, DataTableProps, DataTableSection };
