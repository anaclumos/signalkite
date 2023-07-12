export const schema = gql`
  type Subscription {
    id: String!
    userId: String!
    newsletterId: String!
    frequency: String!
    time: String!
    length: String!
    locale: String!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    deleted: Boolean!
  }

  type Query {
    subscriptions: [Subscription!]! @requireAuth
    subscription(id: String!): Subscription @requireAuth
  }

  input CreateSubscriptionInput {
    userId: String!
    newsletterId: String!
    frequency: String!
    time: String!
    length: String!
    locale: String!
    active: Boolean!
    deleted: Boolean!
  }

  input UpdateSubscriptionInput {
    userId: String
    newsletterId: String
    frequency: String
    time: String
    length: String
    locale: String
    active: Boolean
    deleted: Boolean
  }

  type Mutation {
    createSubscription(input: CreateSubscriptionInput!): Subscription!
      @requireAuth
    updateSubscription(
      id: String!
      input: UpdateSubscriptionInput!
    ): Subscription! @requireAuth
    deleteSubscription(id: String!): Subscription! @requireAuth
  }
`
