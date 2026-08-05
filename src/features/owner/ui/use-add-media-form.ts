import { useForm, type UseFormReturnType } from '@mantine/form';
import {
  EMPTY_ADD_MEDIA_FORM,
  FEDERAL_MEDIA_COVERAGE,
  getSocialItems,
  isInternationalMedia,
  isRegionalMedia,
  sanitizePricingSelections,
  syncSocialNetworksWithBasicServices,
  type AddMediaFormValues,
} from '../model/add-media-form';

export type AddMediaForm = UseFormReturnType<AddMediaFormValues>;

const isValidUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    new URL(withProtocol);
    return true;
  } catch {
    return false;
  }
};

const applyBasicServicesUpdate = (
  basicServices: AddMediaFormValues['basicServices'],
  current: AddMediaFormValues,
): AddMediaFormValues => {
  const socialIds = getSocialItems(basicServices).map((item) => item.id);
  const sanitizedServicePackage = sanitizePricingSelections(basicServices, current.servicePackage);

  return {
    ...current,
    basicServices,
    servicePackage: sanitizedServicePackage,
    socialNetworks: syncSocialNetworksWithBasicServices(socialIds, current.socialNetworks),
  };
};

const useAddMediaForm = (initialValues: AddMediaFormValues = EMPTY_ADD_MEDIA_FORM) => {
  const form = useForm<AddMediaFormValues>({
    mode: 'controlled',
    initialValues,
    validate: {
      name: (value) => (value.trim() ? null : 'Укажите название СМИ'),
      url: (value) => {
        if (!value.trim()) return 'Укажите сайт';
        return isValidUrl(value) ? null : 'Некорректный URL';
      },
      region: (value, values) => {
        if (isRegionalMedia(values.coverage)) {
          return value.trim() ? null : 'Выберите регион';
        }

        if (isInternationalMedia(values.coverage)) {
          return value.trim() ? null : 'Выберите страну';
        }

        return null;
      },
    },
  });

  const setCoverage = (coverage: string | null) => {
    const next = coverage ?? '';

    form.setValues({
      coverage: next,
      region: '',
      ...(next === FEDERAL_MEDIA_COVERAGE ? { city: '' } : {}),
    });
  };

  const setBasicServices = (basicServices: AddMediaFormValues['basicServices']) => {
    form.setValues(applyBasicServicesUpdate(basicServices, form.getValues()));
  };

  const setServicePackage = (servicePackage: AddMediaFormValues['servicePackage']) => {
    form.setFieldValue('servicePackage', servicePackage);
  };

  return {
    form,
    setCoverage,
    setBasicServices,
    setServicePackage,
  };
};

export { useAddMediaForm };
