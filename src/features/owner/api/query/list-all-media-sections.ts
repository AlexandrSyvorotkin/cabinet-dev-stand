import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type {
  ListAllMediaSectionsQuery,
  ListAllMediaSectionsQueryVariables,
} from '@/shared/api/graphql';

export const LIST_ALL_MEDIA_SECTIONS: TypedDocumentNode<
  ListAllMediaSectionsQuery,
  ListAllMediaSectionsQueryVariables
> = gql`
  query ListAllMediaSections {
    listAllMediaSections(input: {}) {
      media_sections {
        id
        code
        name
      }
    }
  }
`;
