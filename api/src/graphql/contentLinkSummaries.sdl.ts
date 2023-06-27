export const schema = gql`
  type ContentLinkSummary {
    id: Int!
    contentId: Int!
    linkSummaryId: Int!
    order: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    Content: Content!
    LinkSummary: LinkSummary!
  }

  type Query {
    contentLinkSummaries: [ContentLinkSummary!]! @requireAuth
    contentLinkSummary(id: Int!): ContentLinkSummary @requireAuth
  }

  input CreateContentLinkSummaryInput {
    contentId: Int!
    linkSummaryId: Int!
    order: Int!
  }

  input UpdateContentLinkSummaryInput {
    contentId: Int
    linkSummaryId: Int
    order: Int
  }

  type Mutation {
    createContentLinkSummary(
      input: CreateContentLinkSummaryInput!
    ): ContentLinkSummary! @requireAuth
    updateContentLinkSummary(
      id: Int!
      input: UpdateContentLinkSummaryInput!
    ): ContentLinkSummary! @requireAuth
    deleteContentLinkSummary(id: Int!): ContentLinkSummary! @requireAuth
  }
`
