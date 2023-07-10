export const schema = gql`
  type Outbox {
    contentSubscriptionId: Int!
    contentId: Int!
    subscriptionId: Int!
    status: String!
    errorMessage: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    outboxes: [Outbox!]! @requireAuth
    outbox(id: Int!): Outbox @requireAuth
  }

  input CreateOutboxInput {
    contentSubscriptionId: Int!
    contentId: Int!
    subscriptionId: Int!
    status: String!
    errorMessage: String
  }

  input UpdateOutboxInput {
    contentSubscriptionId: Int
    contentId: Int
    subscriptionId: Int
    status: String
    errorMessage: String
  }

  type Mutation {
    createOutbox(input: CreateOutboxInput!): Outbox! @requireAuth
    updateOutbox(id: Int!, input: UpdateOutboxInput!): Outbox! @requireAuth
    deleteOutbox(id: Int!): Outbox! @requireAuth
  }
`;
