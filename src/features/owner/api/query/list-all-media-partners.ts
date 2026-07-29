import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type {
  ListAllMediaPartnersQuery,
  ListAllMediaPartnersQueryVariables,
} from '@/shared/api/graphql';

export const LIST_ALL_MEDIA_PARTNERS: TypedDocumentNode<
  ListAllMediaPartnersQuery,
  ListAllMediaPartnersQueryVariables
> = gql`
  query ListAllMediaPartners {
    listAllMediaPartners(input: {}) {
      media_partners {
        id
        name
        description
        is_active
        is_top
        created_at
        updated_at
      }
    }
  }
`;
