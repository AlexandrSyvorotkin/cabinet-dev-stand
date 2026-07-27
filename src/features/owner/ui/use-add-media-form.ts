import { useState } from 'react';
import {
  EMPTY_ADD_MEDIA_FORM,
  FEDERAL_MEDIA_COVERAGE,
  getSocialItems,
  sanitizePricingSelections,
  syncSocialNetworksWithBasicServices,
  type AddMediaFormValues,
} from '../model/add-media-form';

const useAddMediaForm = (initialValues: AddMediaFormValues = EMPTY_ADD_MEDIA_FORM) => {
  const [values, setValues] = useState<AddMediaFormValues>(initialValues);

  const reset = () => {
    setValues(EMPTY_ADD_MEDIA_FORM);
  };

  const updateField = <K extends keyof AddMediaFormValues>(
    field: K,
    value: AddMediaFormValues[K],
  ) => {
    setValues((current) => {
      const next = { ...current, [field]: value };

      if (field === 'coverage') {
        next.region = '';

        if (value === FEDERAL_MEDIA_COVERAGE) {
          next.city = '';
        }
      }

      return next;
    });
  };

  const applyBasicServicesUpdate = (
    basicServices: AddMediaFormValues['basicServices'],
    current: AddMediaFormValues,
  ): AddMediaFormValues => {
    const socialIds = getSocialItems(basicServices).map((item) => item.id);
    const sanitizedPricingRules = sanitizePricingSelections(basicServices, current.pricingRules);

    return {
      ...current,
      basicServices,
      pricingRules: sanitizedPricingRules,
      socialNetworks: syncSocialNetworksWithBasicServices(
        socialIds,
        current.socialNetworks,
      ),
    };
  };

  const handleBasicServicesChange = (basicServices: AddMediaFormValues['basicServices']) => {
    setValues((current) => applyBasicServicesUpdate(basicServices, current));
  };

  const handlePricingRulesChange = (pricingRules: AddMediaFormValues['pricingRules']) => {
    setValues((current) => ({
      ...current,
      pricingRules,
    }));
  };

  return {
    values,
    reset,
    updateField,
    handleBasicServicesChange,
    handlePricingRulesChange,
  };
};

export { useAddMediaForm };
