import { MOCK_USERS } from '../mock/users';
import type { AuthUser } from '@/shared/model';

type LoginInput = {
  email: string;
  password: string;
};

const login = ({ email, password }: LoginInput): AuthUser | null => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = MOCK_USERS.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password,
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

export { login };
export type { LoginInput };
