/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateMediaPartner($input: CreateMediaPartnerInput!) {\n    createMediaPartner(input: $input) {\n      mediaPartnerId\n    }\n  }\n": typeof types.CreateMediaPartnerDocument,
    "\n  query GetMediaPartnerById($mediaId: String!) {\n    getMediaPartnerById(input: { media_id: $mediaId }) {\n      id\n      name\n      description\n      is_active\n      is_top\n      created_at\n      updated_at\n    }\n  }\n": typeof types.GetMediaPartnerByIdDocument,
    "\n  query ListAllMediaPartners {\n    listAllMediaPartners(input: {}) {\n      media_partners {\n        id\n        name\n        description\n        is_active\n        is_top\n        created_at\n        updated_at\n      }\n    }\n  }\n": typeof types.ListAllMediaPartnersDocument,
    "\n  query ListAllMediaSections {\n    listAllMediaSections(input: {}) {\n      media_sections {\n        id\n        code\n        name\n      }\n    }\n  }\n": typeof types.ListAllMediaSectionsDocument,
};
const documents: Documents = {
    "\n  mutation CreateMediaPartner($input: CreateMediaPartnerInput!) {\n    createMediaPartner(input: $input) {\n      mediaPartnerId\n    }\n  }\n": types.CreateMediaPartnerDocument,
    "\n  query GetMediaPartnerById($mediaId: String!) {\n    getMediaPartnerById(input: { media_id: $mediaId }) {\n      id\n      name\n      description\n      is_active\n      is_top\n      created_at\n      updated_at\n    }\n  }\n": types.GetMediaPartnerByIdDocument,
    "\n  query ListAllMediaPartners {\n    listAllMediaPartners(input: {}) {\n      media_partners {\n        id\n        name\n        description\n        is_active\n        is_top\n        created_at\n        updated_at\n      }\n    }\n  }\n": types.ListAllMediaPartnersDocument,
    "\n  query ListAllMediaSections {\n    listAllMediaSections(input: {}) {\n      media_sections {\n        id\n        code\n        name\n      }\n    }\n  }\n": types.ListAllMediaSectionsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateMediaPartner($input: CreateMediaPartnerInput!) {\n    createMediaPartner(input: $input) {\n      mediaPartnerId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMediaPartner($input: CreateMediaPartnerInput!) {\n    createMediaPartner(input: $input) {\n      mediaPartnerId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMediaPartnerById($mediaId: String!) {\n    getMediaPartnerById(input: { media_id: $mediaId }) {\n      id\n      name\n      description\n      is_active\n      is_top\n      created_at\n      updated_at\n    }\n  }\n"): (typeof documents)["\n  query GetMediaPartnerById($mediaId: String!) {\n    getMediaPartnerById(input: { media_id: $mediaId }) {\n      id\n      name\n      description\n      is_active\n      is_top\n      created_at\n      updated_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListAllMediaPartners {\n    listAllMediaPartners(input: {}) {\n      media_partners {\n        id\n        name\n        description\n        is_active\n        is_top\n        created_at\n        updated_at\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListAllMediaPartners {\n    listAllMediaPartners(input: {}) {\n      media_partners {\n        id\n        name\n        description\n        is_active\n        is_top\n        created_at\n        updated_at\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListAllMediaSections {\n    listAllMediaSections(input: {}) {\n      media_sections {\n        id\n        code\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListAllMediaSections {\n    listAllMediaSections(input: {}) {\n      media_sections {\n        id\n        code\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;