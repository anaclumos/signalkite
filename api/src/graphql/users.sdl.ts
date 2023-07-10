export const schema = gql`
  type User {
    id: Int!
    displayName: String
    timezone: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    username: String!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
    deleted: Boolean!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    displayName: String
    timezone: String!
    username: String!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
    deleted: Boolean!
  }

  input UpdateUserInput {
    displayName: String
    timezone: String
    username: String
    email: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
    deleted: Boolean
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`;
