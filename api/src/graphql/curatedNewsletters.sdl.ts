export const schema = gql`
  type CuratedNewsletter {
    id: Int!
    publicNewsletterHandle: String!
    newsletterName: String!
    description: String
    userId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    Subscription: [Subscription]!
    Content: [Content]!
    User: User!
  }

  type Query {
    curatedNewsletters: [CuratedNewsletter!]! @requireAuth
    curatedNewsletter(id: Int!): CuratedNewsletter @requireAuth
  }

  input CreateCuratedNewsletterInput {
    publicNewsletterHandle: String!
    newsletterName: String!
    description: String
    userId: Int!
  }

  input UpdateCuratedNewsletterInput {
    publicNewsletterHandle: String
    newsletterName: String
    description: String
    userId: Int
  }

  type Mutation {
    createCuratedNewsletter(
      input: CreateCuratedNewsletterInput!
    ): CuratedNewsletter! @requireAuth
    updateCuratedNewsletter(
      id: Int!
      input: UpdateCuratedNewsletterInput!
    ): CuratedNewsletter! @requireAuth
    deleteCuratedNewsletter(id: Int!): CuratedNewsletter! @requireAuth
  }
`
