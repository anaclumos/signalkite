export const schema = gql`
  type Subscription {
    id: Int!
    userId: Int!
    curatedNewsletterId: Int
    newsletterId: Int
    frequency: String!
    time: String!
    length: String!
    BCP47: String!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    subscriptions: [Subscription!]! @requireAuth
    subscription(id: Int!): Subscription @requireAuth
  }

  input CreateSubscriptionInput {
    userId: Int!
    curatedNewsletterId: Int
    newsletterId: Int
    frequency: String!
    time: String!
    length: String!
    BCP47: String!
    active: Boolean!
  }

  input UpdateSubscriptionInput {
    userId: Int
    curatedNewsletterId: Int
    newsletterId: Int
    frequency: String
    time: String
    length: String
    BCP47: String
    active: Boolean
  }

  type Mutation {
    createSubscription(input: CreateSubscriptionInput!): Subscription!
      @requireAuth
    updateSubscription(
      id: Int!
      input: UpdateSubscriptionInput!
    ): Subscription! @requireAuth
    deleteSubscription(id: Int!): Subscription! @requireAuth
  }
`
