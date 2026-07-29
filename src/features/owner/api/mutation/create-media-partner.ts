import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type {
  CreateMediaPartnerMutation,
  CreateMediaPartnerMutationVariables,
} from '@/shared/api/graphql';

export const CREATE_MEDIA_PARTNER: TypedDocumentNode<
  CreateMediaPartnerMutation,
  CreateMediaPartnerMutationVariables
> = gql`
  mutation CreateMediaPartner($input: CreateMediaPartnerInput!) {
    createMediaPartner(input: $input) {
      mediaPartnerId
    }
  }
`;
