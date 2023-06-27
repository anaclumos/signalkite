export const schema = gql`
  type LinkSummary {
    id: Int!
    linkUrl: String!
    title: String!
    linkSummary: String!
    BCP47: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    ContentLinkSummary: [ContentLinkSummary]!
  }

  type Query {
    linkSummaries: [LinkSummary!]! @requireAuth
    linkSummary(id: Int!): LinkSummary @requireAuth
  }

  input CreateLinkSummaryInput {
    linkUrl: String!
    title: String!
    linkSummary: String!
    BCP47: String!
  }

  input UpdateLinkSummaryInput {
    linkUrl: String
    title: String
    linkSummary: String
    BCP47: String
  }

  type Mutation {
    createLinkSummary(input: CreateLinkSummaryInput!): LinkSummary! @requireAuth
    updateLinkSummary(id: Int!, input: UpdateLinkSummaryInput!): LinkSummary!
      @requireAuth
    deleteLinkSummary(id: Int!): LinkSummary! @requireAuth
  }
`
