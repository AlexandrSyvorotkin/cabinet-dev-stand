import {
  REGISTER_ROLES,
  type RegisterFormValues,
  type RegisterRole,
} from '../model/register-form';
import type { AuthUser } from '@/shared/model';
import { USER_ROLES } from '@/shared/model';

type RegisterInput = {
  role: RegisterRole;
  values: RegisterFormValues;
};

type RegisterResult =
  | {
      success: true;
      user: AuthUser;
    }
  | {
      success: true;
      user: null;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

const register = ({ role, values }: RegisterInput): RegisterResult => {
  const normalizedEmail = values.email.trim().toLowerCase();

  if (role === REGISTER_ROLES.EXECUTOR) {
    return {
      success: true,
      user: {
        id: `owner-${Date.now()}`,
        email: normalizedEmail,
        name: values.nickname.trim(),
        role: USER_ROLES.OWNER,
      },
    };
  }

  return {
    success: true,
    user: null,
    message:
      'Регистрация заказчика принята. Мы свяжемся с вами после проверки данных.',
  };
};

export { register };
export type { RegisterInput, RegisterResult };
