import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type {
  GetMediaPartnerByIdQuery,
  GetMediaPartnerByIdQueryVariables,
} from '@/shared/api/graphql';

export const GET_MEDIA_PARTNER_BY_ID: TypedDocumentNode<
  GetMediaPartnerByIdQuery,
  GetMediaPartnerByIdQueryVariables
> = gql`
  query GetMediaPartnerById($mediaId: String!) {
    getMediaPartnerById(input: { media_id: $mediaId }) {
      id
      name
      description
      is_active
      is_top
      created_at
      updated_at
    }
  }
`;
