export const schema = gql`
  type Newsletter {
    id: String!
    handle: String!
    name: String!
    keyword: String!
    locale: String!
    region: String!
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deleted: Boolean!
  }

  type Query {
    newsletters: [Newsletter!]! @requireAuth
    newsletter(id: String!): Newsletter @requireAuth
  }

  input CreateNewsletterInput {
    handle: String!
    name: String!
    keyword: String!
    locale: String!
    region: String!
    userId: String!
    deleted: Boolean!
  }

  input UpdateNewsletterInput {
    handle: String
    name: String
    keyword: String
    locale: String
    region: String
    userId: String
    deleted: Boolean
  }

  type Mutation {
    createNewsletter(input: CreateNewsletterInput!): Newsletter! @requireAuth
    updateNewsletter(id: String!, input: UpdateNewsletterInput!): Newsletter!
      @requireAuth
    deleteNewsletter(id: String!): Newsletter! @requireAuth
  }
`
