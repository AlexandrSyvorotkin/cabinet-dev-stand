import { Button, Group, Stack, Title } from '@mantine/core';
import { Link, useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/shared/model';
import { useCustomerOrders } from '../model/customer-orders-context';
import { serializePlaceOrderPayload } from '../model/place-order-form';
import { PlaceOrderForm } from './place-order-form';
import { usePlaceOrderForm } from './use-place-order-form';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { addOrder } = useCustomerOrders();
  const { values, updateField } = usePlaceOrderForm();

  const handleSubmit = () => {
    const payload = serializePlaceOrderPayload(values);
    const order = addOrder(values);
    console.log('[PlaceOrder] payload:', payload, 'order:', order);
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
        <Title order={3}>Разместить заказ</Title>
      </Group>

      <PlaceOrderForm values={values} onFieldChange={updateField} />

      <Group justify="flex-end">
        <Button component={Link} to={ROUTES.CUSTOMER} variant="default">
          Отмена
        </Button>
        <Button onClick={handleSubmit}>Разместить</Button>
      </Group>
    </Stack>
  );
};

export { PlaceOrderPage };
