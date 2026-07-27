export const REGISTER_ROLES = {
  CUSTOMER: 'customer',
  EXECUTOR: 'executor',
} as const;

export type RegisterRole = (typeof REGISTER_ROLES)[keyof typeof REGISTER_ROLES];

export const REGISTER_ROLE_LABELS: Record<RegisterRole, string> = {
  customer: 'Заказчик',
  executor: 'Исполнитель',
};

export type RegisterFormValues = {
  nickname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  companyName: string;
  prExperience: string;
  workDirections: string;
  campaignFrequency: string;
  referralSource: string;
  mediaName: string;
  mediaUrl: string;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const createEmptyRegisterForm = (): RegisterFormValues => ({
  nickname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
  companyName: '',
  prExperience: '',
  workDirections: '',
  campaignFrequency: '',
  referralSource: '',
  mediaName: '',
  mediaUrl: '',
});

const validateRegisterForm = (
  values: RegisterFormValues,
  role: RegisterRole,
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  if (!values.nickname.trim()) {
    errors.nickname = 'Не заполнено';
  }

  if (!values.email.trim()) {
    errors.email = 'Не заполнено';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Не заполнено';
  }

  if (!values.password) {
    errors.password = 'Не заполнено';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Не заполнено';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  if (!values.termsAccepted) {
    errors.termsAccepted = 'Необходимо принять условия';
  }

  if (role === REGISTER_ROLES.EXECUTOR) {
    if (!values.mediaName.trim()) {
      errors.mediaName = 'Не заполнено';
    }

    if (!values.mediaUrl.trim()) {
      errors.mediaUrl = 'Не заполнено';
    }
  }

  return errors;
};

const hasRegisterFormErrors = (errors: RegisterFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export {
  createEmptyRegisterForm,
  hasRegisterFormErrors,
  validateRegisterForm,
};
