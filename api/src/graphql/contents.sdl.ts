export const schema = gql`
  type Content {
    id: Int!
    markdownContent: String
    BCP47: String!
    curatedNewsletterId: Int
    newsletterId: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    contents: [Content!]! @requireAuth
    content(id: Int!): Content @requireAuth
  }

  input CreateContentInput {
    markdownContent: String
    BCP47: String!
    curatedNewsletterId: Int
    newsletterId: Int
  }

  input UpdateContentInput {
    markdownContent: String
    BCP47: String
    curatedNewsletterId: Int
    newsletterId: Int
  }

  type Mutation {
    createContent(input: CreateContentInput!): Content! @requireAuth
    updateContent(id: Int!, input: UpdateContentInput!): Content! @requireAuth
    deleteContent(id: Int!): Content! @requireAuth
  }
`;
