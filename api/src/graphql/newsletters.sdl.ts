export const schema = gql`
  type Newsletter {
    id: Int!
    publicNewsletterHandle: String!
    newsletterName: String!
    keyword: String!
    targetRegion: String!
    userId: Int!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    newsletters: [Newsletter!]! @requireAuth
    newsletter(id: Int!): Newsletter @requireAuth
  }

  input CreateNewsletterInput {
    publicNewsletterHandle: String!
    newsletterName: String!
    keyword: String!
    targetRegion: String!
    userId: Int!
    active: Boolean!
  }

  input UpdateNewsletterInput {
    publicNewsletterHandle: String
    newsletterName: String
    keyword: String
    targetRegion: String
    userId: Int
    active: Boolean
  }

  type Mutation {
    createNewsletter(input: CreateNewsletterInput!): Newsletter! @requireAuth
    updateNewsletter(id: Int!, input: UpdateNewsletterInput!): Newsletter!
      @requireAuth
    deleteNewsletter(id: Int!): Newsletter! @requireAuth
  }
`;
