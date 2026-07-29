import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { env } from '@/shared/config';
import { ensureValidAccessToken } from '@/shared/model/session';

const PUBLIC_OPERATIONS = new Set(['login', 'Refresh']);

const httpLink = new HttpLink({
  uri: env.graphQlUrl,
});

const authLink = setContext(async ({ operationName }, { headers }) => {
  if (operationName && PUBLIC_OPERATIONS.has(operationName)) {
    return { headers };
  }

  const token = await ensureValidAccessToken();

  if (!token) {
    return { headers };
  }

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export { client };
