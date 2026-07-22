import { useState } from 'react';
import {
  EMPTY_PLACE_ORDER_FORM,
  type PlaceOrderFormValues,
} from '../model/place-order-form';

const usePlaceOrderForm = (initialValues: PlaceOrderFormValues = EMPTY_PLACE_ORDER_FORM) => {
  const [values, setValues] = useState<PlaceOrderFormValues>(initialValues);

  const reset = () => {
    setValues(EMPTY_PLACE_ORDER_FORM);
  };

  const updateField = <K extends keyof PlaceOrderFormValues>(
    field: K,
    value: PlaceOrderFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return {
    values,
    reset,
    updateField,
  };
};

export { usePlaceOrderForm };
