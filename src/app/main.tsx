import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { client } from '@/shared/api';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </ApolloProvider>
  </StrictMode>,
);
