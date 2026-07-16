import {
  Anchor,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { formatYesNo, type OwnerOrder } from '../model/order';

type OrderDetailsProps = {
  order: OwnerOrder;
};

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <Stack gap={4}>
      <Text size="xs" tt="uppercase" fw={600} c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Stack>
  );
};

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <Stack gap="md">
      <Stack gap={4}>
        <Text size="xs" tt="uppercase" fw={600} c="dimmed">
          Оригинал новости
        </Text>
        <Anchor href={order.newsUrl} target="_blank" rel="noopener noreferrer" size="sm">
          {order.newsUrl}
        </Anchor>
      </Stack>

      <DetailField label="Ключевые слова для заголовка" value={order.keywords} />

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <DetailField label="Тип рерайта" value={order.rewriteType} />
        <DetailField
          label="Ссылка на источник"
          value={formatYesNo(order.hasSourceLink)}
        />
        <DetailField
          label="Подпись «на правах рекламы»"
          value={formatYesNo(order.hasAdSignature)}
        />
      </SimpleGrid>

      <DetailField
        label="Возможна полная перепечатка"
        value={formatYesNo(order.canFullReprint)}
      />
      <DetailField label="Тип размещения" value={order.placementType} />
    </Stack>
  );
};

export { OrderDetails };
