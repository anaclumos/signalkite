export const schema = gql`
  type LinkSummaryTranslation {
    id: Int!
    title: String!
    linkSummaryId: Int!
    linkSummary: String!
    commentSummary: String
    BCP47: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    linkSummaryTranslations: [LinkSummaryTranslation!]! @requireAuth
    linkSummaryTranslation(id: Int!): LinkSummaryTranslation @requireAuth
  }

  input CreateLinkSummaryTranslationInput {
    title: String!
    linkSummaryId: Int!
    linkSummary: String!
    commentSummary: String
    BCP47: String!
  }

  input UpdateLinkSummaryTranslationInput {
    title: String
    linkSummaryId: Int
    linkSummary: String
    commentSummary: String
    BCP47: String
  }

  type Mutation {
    createLinkSummaryTranslation(
      input: CreateLinkSummaryTranslationInput!
    ): LinkSummaryTranslation! @requireAuth
    updateLinkSummaryTranslation(
      id: Int!
      input: UpdateLinkSummaryTranslationInput!
    ): LinkSummaryTranslation! @requireAuth
    deleteLinkSummaryTranslation(id: Int!): LinkSummaryTranslation! @requireAuth
  }
`;
