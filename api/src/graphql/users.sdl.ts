export const schema = gql`
  type User {
    id: Int!
    displayName: String
    username: String!
    email: String!
    loginToken: String
    loginTokenExpiresAt: DateTime
    isActive: Boolean!
    timezone: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    displayName: String
    username: String!
    email: String!
    loginToken: String
    loginTokenExpiresAt: DateTime
    isActive: Boolean!
    timezone: String!
  }

  input UpdateUserInput {
    displayName: String
    username: String
    email: String
    loginToken: String
    loginTokenExpiresAt: DateTime
    isActive: Boolean
    timezone: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    generateToken(email: String!): userTokenResponse! @skipAuth
  }
`;
