import {buildSchema} from 'graphql';

const schema = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }

  input UserData {
    name: String!
    email: String!
    password: String!
  }

  input PostInfoData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootMutation {
    createUser(userInput: UserData): User!
    createPost(postInput: PostInfoData): Post!
    updatePost(id: ID!, postInput: PostInfoData): Post!
    deletePost(id: ID!): Boolean
    updateStatus(status: String!): User!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts(page: Int): PostData!
    post(id: ID!): Post!
    user: User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

export {schema};
