import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { ROUTES } from '@/shared/model';
import { inferFormDataFromOrder } from '../model/create-customer-order';
import { useCustomerOrders } from '../model/customer-orders-context';
import { serializePlaceOrderPayload } from '../model/place-order-form';
import { PlaceOrderForm } from './place-order-form';
import { usePlaceOrderForm } from './use-place-order-form';

const EditOrderPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false });
  const { getOrderById, updateOrder } = useCustomerOrders();
  const order = getOrderById(Number(orderId));
  const { values, updateField } = usePlaceOrderForm(
    order ? inferFormDataFromOrder(order) : undefined,
  );

  if (!order) {
    return (
      <Stack gap="md">
        <Text c="dimmed">Заказ не найден.</Text>
        <Button component={Link} to={ROUTES.CUSTOMER} variant="light" w="fit-content">
          К заказам
        </Button>
      </Stack>
    );
  }

  if (order.tab !== 'in-progress') {
    return (
      <Stack gap="md">
        <Text c="dimmed">Редактирование доступно только для заказов в работе.</Text>
        <Button component={Link} to={ROUTES.CUSTOMER} variant="light" w="fit-content">
          К заказам
        </Button>
      </Stack>
    );
  }

  const handleSubmit = () => {
    const payload = serializePlaceOrderPayload(values);
    const updatedOrder = updateOrder(order.id, values);
    console.log('[EditOrder] payload:', payload, 'order:', updatedOrder);
    navigate({ to: ROUTES.CUSTOMER });
  };

  return (
    <Stack gap="lg">
      <Button
        component={Link}
        to={ROUTES.CUSTOMER}
        variant="subtle"
        w="fit-content"
        px={0}
      >
        ← К заказам
      </Button>

      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Title order={3}>Редактировать заказ #{order.id}</Title>
      </Group>

      <PlaceOrderForm values={values} onFieldChange={updateField} />

      <Group justify="flex-end">
        <Button component={Link} to={ROUTES.CUSTOMER} variant="default">
          Отмена
        </Button>
        <Button onClick={handleSubmit}>Сохранить</Button>
      </Group>
    </Stack>
  );
};

export { EditOrderPage };
