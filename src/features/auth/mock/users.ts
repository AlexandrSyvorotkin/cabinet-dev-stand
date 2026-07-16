import { USER_ROLES, type UserRole } from '@/shared/model';

type MockUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
};

const MOCK_PASSWORD = '1234';

const MOCK_USERS: MockUser[] = [
  {
    id: 'owner-1',
    email: 'owner@media.ru',
    name: 'Иван Петров',
    role: USER_ROLES.OWNER,
    password: MOCK_PASSWORD,
  },
  {
    id: 'customer-1',
    email: 'customer@company.ru',
    name: 'Анна Смирнова',
    role: USER_ROLES.CUSTOMER,
    password: MOCK_PASSWORD,
  },
  {
    id: 'moderator-1',
    email: 'moderator@media.ru',
    name: 'Сергей Козлов',
    role: USER_ROLES.MODERATOR,
    password: MOCK_PASSWORD,
  },
];

export { MOCK_PASSWORD, MOCK_USERS };
export type { MockUser };
