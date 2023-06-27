export const schema = gql`
  type CustomNewsletter {
    id: Int!
    publicNewsletterHandle: String!
    keyword: String!
    targetRegion: String!
    userId: Int!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    Subscription: [Subscription]!
    Content: [Content]!
    User: User!
  }

  type Query {
    customNewsletters: [CustomNewsletter!]! @requireAuth
    customNewsletter(id: Int!): CustomNewsletter @requireAuth
  }

  input CreateCustomNewsletterInput {
    publicNewsletterHandle: String!
    keyword: String!
    targetRegion: String!
    userId: Int!
    active: Boolean!
  }

  input UpdateCustomNewsletterInput {
    publicNewsletterHandle: String
    keyword: String
    targetRegion: String
    userId: Int
    active: Boolean
  }

  type Mutation {
    createCustomNewsletter(
      input: CreateCustomNewsletterInput!
    ): CustomNewsletter! @requireAuth
    updateCustomNewsletter(
      id: Int!
      input: UpdateCustomNewsletterInput!
    ): CustomNewsletter! @requireAuth
    deleteCustomNewsletter(id: Int!): CustomNewsletter! @requireAuth
  }
`
