/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateMpsInMp = {
  media_section_id: number;
  offers?: Array<CreateMediaOffersInput | null | undefined> | null | undefined;
  title: string;
  url: string;
};

export type CreateMediaOffersInput = {
  name: string;
  partner_section_id?: string | null | undefined;
  price?: number | null | undefined;
  price_with_discount?: number | null | undefined;
};

export type CreateMediaPartnerInput = {
  description: string;
  media_promotions?: Array<CreateMediaPromotionInput> | null | undefined;
  media_sections?: Array<CreateMpsInMp | null | undefined> | null | undefined;
  name: string;
};

export type CreateMediaPromotionInput = {
  conditions: Array<CreatePromotionConditionInput>;
  logic: PromotionLogic;
  targets: Array<CreatePromotionTargetInput>;
  type: PromotionType;
};

export type CreatePromotionConditionInput = {
  offer_id: string;
};

export type CreatePromotionTargetInput = {
  offer_id: string;
  value: number;
};

export type PromotionLogic =
  | 'ALL'
  | 'ANY';

export type PromotionType =
  | 'BONUS'
  | 'DISCOUNT';

export type CreateMediaPartnerMutationVariables = Exact<{
  input: CreateMediaPartnerInput;
}>;


export type CreateMediaPartnerMutation = { createMediaPartner: { mediaPartnerId: string } };

export type GetMediaPartnerByIdQueryVariables = Exact<{
  mediaId: string;
}>;


export type GetMediaPartnerByIdQuery = { getMediaPartnerById: { id: string, name: string, description: string | null, is_active: boolean | null, is_top: boolean | null, created_at: string, updated_at: string } };

export type ListAllMediaPartnersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListAllMediaPartnersQuery = { listAllMediaPartners: { media_partners: Array<{ id: string, name: string, description: string, is_active: boolean | null, is_top: boolean | null, created_at: string, updated_at: string } | null> | null } };

export type ListAllMediaSectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListAllMediaSectionsQuery = { listAllMediaSections: { media_sections: Array<{ id: number, code: string, name: string } | null> } };


export const CreateMediaPartnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMediaPartner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMediaPartnerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMediaPartner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mediaPartnerId"}}]}}]}}]} as unknown as DocumentNode<CreateMediaPartnerMutation, CreateMediaPartnerMutationVariables>;
export const GetMediaPartnerByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMediaPartnerById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMediaPartnerById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"media_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_active"}},{"kind":"Field","name":{"kind":"Name","value":"is_top"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetMediaPartnerByIdQuery, GetMediaPartnerByIdQueryVariables>;
export const ListAllMediaPartnersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAllMediaPartners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listAllMediaPartners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media_partners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"is_active"}},{"kind":"Field","name":{"kind":"Name","value":"is_top"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<ListAllMediaPartnersQuery, ListAllMediaPartnersQueryVariables>;
export const ListAllMediaSectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAllMediaSections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listAllMediaSections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media_sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ListAllMediaSectionsQuery, ListAllMediaSectionsQueryVariables>;