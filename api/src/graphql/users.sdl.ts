export const schema = gql`
  type User {
    id: Int!
    username: String!
    password: String!
    email: String!
    displayName: String
    isActive: Boolean!
    emailVerified: Boolean!
    timezone: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    Subscription: [Subscription]!
    CustomNewsletter: [CustomNewsletter]!
    CuratedNewsletter: [CuratedNewsletter]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    username: String!
    password: String!
    email: String!
    displayName: String
    isActive: Boolean!
    emailVerified: Boolean!
    timezone: String!
  }

  input UpdateUserInput {
    username: String
    password: String
    email: String
    displayName: String
    isActive: Boolean
    emailVerified: Boolean
    timezone: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
