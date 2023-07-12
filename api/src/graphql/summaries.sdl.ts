export const schema = gql`
  type Summary {
    id: String!
    title: String!
    origin: String!
    originBody: String
    originSummary: String
    originLocale: String
    commentLink: String
    commentBody: String
    commentSummary: String
    commentLocale: String
    points: Int
    commentCount: Int
    downloadMethod: String
    retryCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    deleted: Boolean!
  }

  type Query {
    summaries: [Summary!]! @requireAuth
    summary(id: String!): Summary @requireAuth
  }

  input CreateSummaryInput {
    title: String!
    origin: String!
    originBody: String
    originSummary: String
    originLocale: String
    commentLink: String
    commentBody: String
    commentSummary: String
    commentLocale: String
    points: Int
    commentCount: Int
    downloadMethod: String
    retryCount: Int!
    deleted: Boolean!
  }

  input UpdateSummaryInput {
    title: String
    origin: String
    originBody: String
    originSummary: String
    originLocale: String
    commentLink: String
    commentBody: String
    commentSummary: String
    commentLocale: String
    points: Int
    commentCount: Int
    downloadMethod: String
    retryCount: Int
    deleted: Boolean
  }

  type Mutation {
    createSummary(input: CreateSummaryInput!): Summary! @requireAuth
    updateSummary(id: String!, input: UpdateSummaryInput!): Summary!
      @requireAuth
    deleteSummary(id: String!): Summary! @requireAuth
  }
`
