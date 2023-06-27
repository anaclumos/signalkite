export const schema = gql`
  type Content {
    id: Int!
    markdownContent: String
    BCP47: String!
    curatedNewsletterId: Int
    customNewsletterId: Int
    createdAt: DateTime!
    updatedAt: DateTime!
    CuratedNewsletter: CuratedNewsletter
    CustomNewsletter: CustomNewsletter
    ContentLinkSummary: [ContentLinkSummary]!
    Outbox: [Outbox]!
  }

  type Query {
    contents: [Content!]! @requireAuth
    content(id: Int!): Content @requireAuth
  }

  input CreateContentInput {
    markdownContent: String
    BCP47: String!
    curatedNewsletterId: Int
    customNewsletterId: Int
  }

  input UpdateContentInput {
    markdownContent: String
    BCP47: String
    curatedNewsletterId: Int
    customNewsletterId: Int
  }

  type Mutation {
    createContent(input: CreateContentInput!): Content! @requireAuth
    updateContent(id: Int!, input: UpdateContentInput!): Content! @requireAuth
    deleteContent(id: Int!): Content! @requireAuth
  }
`
