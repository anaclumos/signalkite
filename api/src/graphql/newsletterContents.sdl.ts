export const schema = gql`
  type NewsletterContent {
    id: String!
    newsletterId: String!
    summaryId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deleted: Boolean!
  }

  type Query {
    newsletterContents: [NewsletterContent!]! @requireAuth
    newsletterContent(id: String!): NewsletterContent @requireAuth
  }

  input CreateNewsletterContentInput {
    newsletterId: String!
    summaryId: String!
    deleted: Boolean!
  }

  input UpdateNewsletterContentInput {
    newsletterId: String
    summaryId: String
    deleted: Boolean
  }

  type Mutation {
    createNewsletterContent(
      input: CreateNewsletterContentInput!
    ): NewsletterContent! @requireAuth
    updateNewsletterContent(
      id: String!
      input: UpdateNewsletterContentInput!
    ): NewsletterContent! @requireAuth
    deleteNewsletterContent(id: String!): NewsletterContent! @requireAuth
  }
`
