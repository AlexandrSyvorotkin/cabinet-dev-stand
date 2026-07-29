import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URL ?? 'https://pwa.phxpro.ru/graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/shared/api/graphql/**'],
  generates: {
    'src/shared/api/graphql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
      config: {
        scalars: {
          Time: 'string',
        },
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
