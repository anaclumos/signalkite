export const schema = gql`
  type LinkSummary {
    id: Int!
    title: String!
    linkUrl: String!
    BCP47: String!
    linkSummary: String
    commentUrl: String
    commentSummary: String
    createdAt: DateTime!
    updatedAt: DateTime!
    body: String
    commentBody: String
    downloadMethod: String
    retryCount: Int!
  }

  type Query {
    linkSummaries: [LinkSummary!]! @requireAuth
    linkSummary(id: Int!): LinkSummary @requireAuth
  }

  input CreateLinkSummaryInput {
    title: String!
    linkUrl: String!
    BCP47: String!
    linkSummary: String
    commentUrl: String
    commentSummary: String
    body: String
    commentBody: String
    downloadMethod: String
    retryCount: Int!
  }

  input UpdateLinkSummaryInput {
    title: String
    linkUrl: String
    BCP47: String
    linkSummary: String
    commentUrl: String
    commentSummary: String
    body: String
    commentBody: String
    downloadMethod: String
    retryCount: Int
  }

  type Mutation {
    createLinkSummary(input: CreateLinkSummaryInput!): LinkSummary! @requireAuth
    updateLinkSummary(id: Int!, input: UpdateLinkSummaryInput!): LinkSummary!
      @requireAuth
    deleteLinkSummary(id: Int!): LinkSummary! @requireAuth
  }
`
