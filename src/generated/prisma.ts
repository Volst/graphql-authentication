import { Prisma as BasePrisma, BasePrismaOptions } from 'prisma-binding'
import { GraphQLResolveInfo } from 'graphql'

export const typeDefs = `
type AggregateUser {
  count: Int!
}

type BatchPayload {
  """
  The number of nodes that have been affected by the Batch operation.
  """
  count: Long!
}

scalar DateTime

"""
The 'Long' scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

"""
An object with an ID
"""
interface Node {
  """
  The id of the object.
  """
  id: ID!
}

"""
Information about pagination in a connection.
"""
type PageInfo {
  """
  When paginating forwards, are there more items?
  """
  hasNextPage: Boolean!
  """
  When paginating backwards, are there more items?
  """
  hasPreviousPage: Boolean!
  """
  When paginating backwards, the cursor to continue.
  """
  startCursor: String
  """
  When paginating forwards, the cursor to continue.
  """
  endCursor: String
}

type User implements Node {
  id: ID!
  email: String!
  password: String!
  name: String!
  inviteToken: String
  inviteAccepted: Boolean!
  emailConfirmed: Boolean!
  emailConfirmToken: String
  resetToken: String
  resetExpires: DateTime
  deletedAt: DateTime
  lastLogin: DateTime
  joinedAt: DateTime!
  isSuper: Boolean!
}

"""
A connection to a list of items.
"""
type UserConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  email: String!
  password: String!
  name: String!
  inviteToken: String
  inviteAccepted: Boolean
  emailConfirmed: Boolean
  emailConfirmToken: String
  resetToken: String
  resetExpires: DateTime
  deletedAt: DateTime
  lastLogin: DateTime
  joinedAt: DateTime!
  isSuper: Boolean
}

"""
An edge in a connection.
"""
type UserEdge {
  """
  The item at the end of the edge.
  """
  node: User!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  name_ASC
  name_DESC
  inviteToken_ASC
  inviteToken_DESC
  inviteAccepted_ASC
  inviteAccepted_DESC
  emailConfirmed_ASC
  emailConfirmed_DESC
  emailConfirmToken_ASC
  emailConfirmToken_DESC
  resetToken_ASC
  resetToken_DESC
  resetExpires_ASC
  resetExpires_DESC
  deletedAt_ASC
  deletedAt_DESC
  lastLogin_ASC
  lastLogin_DESC
  joinedAt_ASC
  joinedAt_DESC
  isSuper_ASC
  isSuper_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  password: String!
  name: String!
  inviteToken: String
  inviteAccepted: Boolean!
  emailConfirmed: Boolean!
  emailConfirmToken: String
  resetToken: String
  resetExpires: DateTime
  deletedAt: DateTime
  lastLogin: DateTime
  joinedAt: DateTime!
  isSuper: Boolean!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [UserSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [UserSubscriptionWhereInput!]
  """
  Logical NOT on all given filters combined by AND.
  """
  NOT: [UserSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: UserWhereInput
}

input UserUpdateInput {
  email: String
  password: String
  name: String
  inviteToken: String
  inviteAccepted: Boolean
  emailConfirmed: Boolean
  emailConfirmToken: String
  resetToken: String
  resetExpires: DateTime
  deletedAt: DateTime
  lastLogin: DateTime
  joinedAt: DateTime
  isSuper: Boolean
}

input UserWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [UserWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [UserWhereInput!]
  """
  Logical NOT on all given filters combined by AND.
  """
  NOT: [UserWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  email: String
  """
  All values that are not equal to given value.
  """
  email_not: String
  """
  All values that are contained in given list.
  """
  email_in: [String!]
  """
  All values that are not contained in given list.
  """
  email_not_in: [String!]
  """
  All values less than the given value.
  """
  email_lt: String
  """
  All values less than or equal the given value.
  """
  email_lte: String
  """
  All values greater than the given value.
  """
  email_gt: String
  """
  All values greater than or equal the given value.
  """
  email_gte: String
  """
  All values containing the given string.
  """
  email_contains: String
  """
  All values not containing the given string.
  """
  email_not_contains: String
  """
  All values starting with the given string.
  """
  email_starts_with: String
  """
  All values not starting with the given string.
  """
  email_not_starts_with: String
  """
  All values ending with the given string.
  """
  email_ends_with: String
  """
  All values not ending with the given string.
  """
  email_not_ends_with: String
  password: String
  """
  All values that are not equal to given value.
  """
  password_not: String
  """
  All values that are contained in given list.
  """
  password_in: [String!]
  """
  All values that are not contained in given list.
  """
  password_not_in: [String!]
  """
  All values less than the given value.
  """
  password_lt: String
  """
  All values less than or equal the given value.
  """
  password_lte: String
  """
  All values greater than the given value.
  """
  password_gt: String
  """
  All values greater than or equal the given value.
  """
  password_gte: String
  """
  All values containing the given string.
  """
  password_contains: String
  """
  All values not containing the given string.
  """
  password_not_contains: String
  """
  All values starting with the given string.
  """
  password_starts_with: String
  """
  All values not starting with the given string.
  """
  password_not_starts_with: String
  """
  All values ending with the given string.
  """
  password_ends_with: String
  """
  All values not ending with the given string.
  """
  password_not_ends_with: String
  name: String
  """
  All values that are not equal to given value.
  """
  name_not: String
  """
  All values that are contained in given list.
  """
  name_in: [String!]
  """
  All values that are not contained in given list.
  """
  name_not_in: [String!]
  """
  All values less than the given value.
  """
  name_lt: String
  """
  All values less than or equal the given value.
  """
  name_lte: String
  """
  All values greater than the given value.
  """
  name_gt: String
  """
  All values greater than or equal the given value.
  """
  name_gte: String
  """
  All values containing the given string.
  """
  name_contains: String
  """
  All values not containing the given string.
  """
  name_not_contains: String
  """
  All values starting with the given string.
  """
  name_starts_with: String
  """
  All values not starting with the given string.
  """
  name_not_starts_with: String
  """
  All values ending with the given string.
  """
  name_ends_with: String
  """
  All values not ending with the given string.
  """
  name_not_ends_with: String
  inviteToken: String
  """
  All values that are not equal to given value.
  """
  inviteToken_not: String
  """
  All values that are contained in given list.
  """
  inviteToken_in: [String!]
  """
  All values that are not contained in given list.
  """
  inviteToken_not_in: [String!]
  """
  All values less than the given value.
  """
  inviteToken_lt: String
  """
  All values less than or equal the given value.
  """
  inviteToken_lte: String
  """
  All values greater than the given value.
  """
  inviteToken_gt: String
  """
  All values greater than or equal the given value.
  """
  inviteToken_gte: String
  """
  All values containing the given string.
  """
  inviteToken_contains: String
  """
  All values not containing the given string.
  """
  inviteToken_not_contains: String
  """
  All values starting with the given string.
  """
  inviteToken_starts_with: String
  """
  All values not starting with the given string.
  """
  inviteToken_not_starts_with: String
  """
  All values ending with the given string.
  """
  inviteToken_ends_with: String
  """
  All values not ending with the given string.
  """
  inviteToken_not_ends_with: String
  inviteAccepted: Boolean
  """
  All values that are not equal to given value.
  """
  inviteAccepted_not: Boolean
  emailConfirmed: Boolean
  """
  All values that are not equal to given value.
  """
  emailConfirmed_not: Boolean
  emailConfirmToken: String
  """
  All values that are not equal to given value.
  """
  emailConfirmToken_not: String
  """
  All values that are contained in given list.
  """
  emailConfirmToken_in: [String!]
  """
  All values that are not contained in given list.
  """
  emailConfirmToken_not_in: [String!]
  """
  All values less than the given value.
  """
  emailConfirmToken_lt: String
  """
  All values less than or equal the given value.
  """
  emailConfirmToken_lte: String
  """
  All values greater than the given value.
  """
  emailConfirmToken_gt: String
  """
  All values greater than or equal the given value.
  """
  emailConfirmToken_gte: String
  """
  All values containing the given string.
  """
  emailConfirmToken_contains: String
  """
  All values not containing the given string.
  """
  emailConfirmToken_not_contains: String
  """
  All values starting with the given string.
  """
  emailConfirmToken_starts_with: String
  """
  All values not starting with the given string.
  """
  emailConfirmToken_not_starts_with: String
  """
  All values ending with the given string.
  """
  emailConfirmToken_ends_with: String
  """
  All values not ending with the given string.
  """
  emailConfirmToken_not_ends_with: String
  resetToken: String
  """
  All values that are not equal to given value.
  """
  resetToken_not: String
  """
  All values that are contained in given list.
  """
  resetToken_in: [String!]
  """
  All values that are not contained in given list.
  """
  resetToken_not_in: [String!]
  """
  All values less than the given value.
  """
  resetToken_lt: String
  """
  All values less than or equal the given value.
  """
  resetToken_lte: String
  """
  All values greater than the given value.
  """
  resetToken_gt: String
  """
  All values greater than or equal the given value.
  """
  resetToken_gte: String
  """
  All values containing the given string.
  """
  resetToken_contains: String
  """
  All values not containing the given string.
  """
  resetToken_not_contains: String
  """
  All values starting with the given string.
  """
  resetToken_starts_with: String
  """
  All values not starting with the given string.
  """
  resetToken_not_starts_with: String
  """
  All values ending with the given string.
  """
  resetToken_ends_with: String
  """
  All values not ending with the given string.
  """
  resetToken_not_ends_with: String
  resetExpires: DateTime
  """
  All values that are not equal to given value.
  """
  resetExpires_not: DateTime
  """
  All values that are contained in given list.
  """
  resetExpires_in: [DateTime!]
  """
  All values that are not contained in given list.
  """
  resetExpires_not_in: [DateTime!]
  """
  All values less than the given value.
  """
  resetExpires_lt: DateTime
  """
  All values less than or equal the given value.
  """
  resetExpires_lte: DateTime
  """
  All values greater than the given value.
  """
  resetExpires_gt: DateTime
  """
  All values greater than or equal the given value.
  """
  resetExpires_gte: DateTime
  deletedAt: DateTime
  """
  All values that are not equal to given value.
  """
  deletedAt_not: DateTime
  """
  All values that are contained in given list.
  """
  deletedAt_in: [DateTime!]
  """
  All values that are not contained in given list.
  """
  deletedAt_not_in: [DateTime!]
  """
  All values less than the given value.
  """
  deletedAt_lt: DateTime
  """
  All values less than or equal the given value.
  """
  deletedAt_lte: DateTime
  """
  All values greater than the given value.
  """
  deletedAt_gt: DateTime
  """
  All values greater than or equal the given value.
  """
  deletedAt_gte: DateTime
  lastLogin: DateTime
  """
  All values that are not equal to given value.
  """
  lastLogin_not: DateTime
  """
  All values that are contained in given list.
  """
  lastLogin_in: [DateTime!]
  """
  All values that are not contained in given list.
  """
  lastLogin_not_in: [DateTime!]
  """
  All values less than the given value.
  """
  lastLogin_lt: DateTime
  """
  All values less than or equal the given value.
  """
  lastLogin_lte: DateTime
  """
  All values greater than the given value.
  """
  lastLogin_gt: DateTime
  """
  All values greater than or equal the given value.
  """
  lastLogin_gte: DateTime
  joinedAt: DateTime
  """
  All values that are not equal to given value.
  """
  joinedAt_not: DateTime
  """
  All values that are contained in given list.
  """
  joinedAt_in: [DateTime!]
  """
  All values that are not contained in given list.
  """
  joinedAt_not_in: [DateTime!]
  """
  All values less than the given value.
  """
  joinedAt_lt: DateTime
  """
  All values less than or equal the given value.
  """
  joinedAt_lte: DateTime
  """
  All values greater than the given value.
  """
  joinedAt_gt: DateTime
  """
  All values greater than or equal the given value.
  """
  joinedAt_gte: DateTime
  isSuper: Boolean
  """
  All values that are not equal to given value.
  """
  isSuper_not: Boolean
}

input UserWhereUniqueInput {
  id: ID
  email: String
}

type Mutation {
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  deleteUser(where: UserWhereUniqueInput!): User
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput): BatchPayload!
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

type Query {
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  user(where: UserWhereUniqueInput!): User
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  """
  Fetches an object given its ID
  """
  node("""
  The ID of an object
  """
  id: ID!): Node
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}
`

export type UserOrderByInput = 
  'id_ASC' |
  'id_DESC' |
  'email_ASC' |
  'email_DESC' |
  'password_ASC' |
  'password_DESC' |
  'name_ASC' |
  'name_DESC' |
  'inviteToken_ASC' |
  'inviteToken_DESC' |
  'inviteAccepted_ASC' |
  'inviteAccepted_DESC' |
  'emailConfirmed_ASC' |
  'emailConfirmed_DESC' |
  'emailConfirmToken_ASC' |
  'emailConfirmToken_DESC' |
  'resetToken_ASC' |
  'resetToken_DESC' |
  'resetExpires_ASC' |
  'resetExpires_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'lastLogin_ASC' |
  'lastLogin_DESC' |
  'joinedAt_ASC' |
  'joinedAt_DESC' |
  'isSuper_ASC' |
  'isSuper_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type MutationType = 
  'CREATED' |
  'UPDATED' |
  'DELETED'

export interface UserWhereUniqueInput {
  id?: ID_Input
  email?: String
}

export interface UserCreateInput {
  email: String
  password: String
  name: String
  inviteToken?: String
  inviteAccepted?: Boolean
  emailConfirmed?: Boolean
  emailConfirmToken?: String
  resetToken?: String
  resetExpires?: DateTime
  deletedAt?: DateTime
  lastLogin?: DateTime
  joinedAt: DateTime
  isSuper?: Boolean
}

export interface UserUpdateInput {
  email?: String
  password?: String
  name?: String
  inviteToken?: String
  inviteAccepted?: Boolean
  emailConfirmed?: Boolean
  emailConfirmToken?: String
  resetToken?: String
  resetExpires?: DateTime
  deletedAt?: DateTime
  lastLogin?: DateTime
  joinedAt?: DateTime
  isSuper?: Boolean
}

export interface UserSubscriptionWhereInput {
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: UserWhereInput
}

export interface UserWhereInput {
  AND?: UserWhereInput[] | UserWhereInput
  OR?: UserWhereInput[] | UserWhereInput
  NOT?: UserWhereInput[] | UserWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  email?: String
  email_not?: String
  email_in?: String[] | String
  email_not_in?: String[] | String
  email_lt?: String
  email_lte?: String
  email_gt?: String
  email_gte?: String
  email_contains?: String
  email_not_contains?: String
  email_starts_with?: String
  email_not_starts_with?: String
  email_ends_with?: String
  email_not_ends_with?: String
  password?: String
  password_not?: String
  password_in?: String[] | String
  password_not_in?: String[] | String
  password_lt?: String
  password_lte?: String
  password_gt?: String
  password_gte?: String
  password_contains?: String
  password_not_contains?: String
  password_starts_with?: String
  password_not_starts_with?: String
  password_ends_with?: String
  password_not_ends_with?: String
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  inviteToken?: String
  inviteToken_not?: String
  inviteToken_in?: String[] | String
  inviteToken_not_in?: String[] | String
  inviteToken_lt?: String
  inviteToken_lte?: String
  inviteToken_gt?: String
  inviteToken_gte?: String
  inviteToken_contains?: String
  inviteToken_not_contains?: String
  inviteToken_starts_with?: String
  inviteToken_not_starts_with?: String
  inviteToken_ends_with?: String
  inviteToken_not_ends_with?: String
  inviteAccepted?: Boolean
  inviteAccepted_not?: Boolean
  emailConfirmed?: Boolean
  emailConfirmed_not?: Boolean
  emailConfirmToken?: String
  emailConfirmToken_not?: String
  emailConfirmToken_in?: String[] | String
  emailConfirmToken_not_in?: String[] | String
  emailConfirmToken_lt?: String
  emailConfirmToken_lte?: String
  emailConfirmToken_gt?: String
  emailConfirmToken_gte?: String
  emailConfirmToken_contains?: String
  emailConfirmToken_not_contains?: String
  emailConfirmToken_starts_with?: String
  emailConfirmToken_not_starts_with?: String
  emailConfirmToken_ends_with?: String
  emailConfirmToken_not_ends_with?: String
  resetToken?: String
  resetToken_not?: String
  resetToken_in?: String[] | String
  resetToken_not_in?: String[] | String
  resetToken_lt?: String
  resetToken_lte?: String
  resetToken_gt?: String
  resetToken_gte?: String
  resetToken_contains?: String
  resetToken_not_contains?: String
  resetToken_starts_with?: String
  resetToken_not_starts_with?: String
  resetToken_ends_with?: String
  resetToken_not_ends_with?: String
  resetExpires?: DateTime
  resetExpires_not?: DateTime
  resetExpires_in?: DateTime[] | DateTime
  resetExpires_not_in?: DateTime[] | DateTime
  resetExpires_lt?: DateTime
  resetExpires_lte?: DateTime
  resetExpires_gt?: DateTime
  resetExpires_gte?: DateTime
  deletedAt?: DateTime
  deletedAt_not?: DateTime
  deletedAt_in?: DateTime[] | DateTime
  deletedAt_not_in?: DateTime[] | DateTime
  deletedAt_lt?: DateTime
  deletedAt_lte?: DateTime
  deletedAt_gt?: DateTime
  deletedAt_gte?: DateTime
  lastLogin?: DateTime
  lastLogin_not?: DateTime
  lastLogin_in?: DateTime[] | DateTime
  lastLogin_not_in?: DateTime[] | DateTime
  lastLogin_lt?: DateTime
  lastLogin_lte?: DateTime
  lastLogin_gt?: DateTime
  lastLogin_gte?: DateTime
  joinedAt?: DateTime
  joinedAt_not?: DateTime
  joinedAt_in?: DateTime[] | DateTime
  joinedAt_not_in?: DateTime[] | DateTime
  joinedAt_lt?: DateTime
  joinedAt_lte?: DateTime
  joinedAt_gt?: DateTime
  joinedAt_gte?: DateTime
  isSuper?: Boolean
  isSuper_not?: Boolean
}

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output
}

/*
 * Information about pagination in a connection.

 */
export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String
  endCursor?: String
}

export interface UserPreviousValues {
  id: ID_Output
  email: String
  password: String
  name: String
  inviteToken?: String
  inviteAccepted: Boolean
  emailConfirmed: Boolean
  emailConfirmToken?: String
  resetToken?: String
  resetExpires?: DateTime
  deletedAt?: DateTime
  lastLogin?: DateTime
  joinedAt: DateTime
  isSuper: Boolean
}

export interface User extends Node {
  id: ID_Output
  email: String
  password: String
  name: String
  inviteToken?: String
  inviteAccepted: Boolean
  emailConfirmed: Boolean
  emailConfirmToken?: String
  resetToken?: String
  resetExpires?: DateTime
  deletedAt?: DateTime
  lastLogin?: DateTime
  joinedAt: DateTime
  isSuper: Boolean
}

/*
 * An edge in a connection.

 */
export interface UserEdge {
  node: User
  cursor: String
}

/*
 * A connection to a list of items.

 */
export interface UserConnection {
  pageInfo: PageInfo
  edges: UserEdge[]
  aggregate: AggregateUser
}

export interface UserSubscriptionPayload {
  mutation: MutationType
  node?: User
  updatedFields?: String[]
  previousValues?: UserPreviousValues
}

export interface AggregateUser {
  count: Int
}

export interface BatchPayload {
  count: Long
}

export type DateTime = string

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The 'Long' scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
*/
export type Long = string

export interface Schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

export type Query = {
  users: (args: { where?: UserWhereInput, orderBy?: UserOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string) => Promise<User[]>
  user: (args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string) => Promise<User | null>
  usersConnection: (args: { where?: UserWhereInput, orderBy?: UserOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string) => Promise<UserConnection>
  node: (args: { id: ID_Output }, info?: GraphQLResolveInfo | string) => Promise<Node | null>
}

export type Mutation = {
  createUser: (args: { data: UserCreateInput }, info?: GraphQLResolveInfo | string) => Promise<User>
  updateUser: (args: { data: UserUpdateInput, where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string) => Promise<User | null>
  deleteUser: (args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string) => Promise<User | null>
  upsertUser: (args: { where: UserWhereUniqueInput, create: UserCreateInput, update: UserUpdateInput }, info?: GraphQLResolveInfo | string) => Promise<User>
  updateManyUsers: (args: { data: UserUpdateInput, where?: UserWhereInput }, info?: GraphQLResolveInfo | string) => Promise<BatchPayload>
  deleteManyUsers: (args: { where?: UserWhereInput }, info?: GraphQLResolveInfo | string) => Promise<BatchPayload>
}

export type Subscription = {
  user: (args: { where?: UserSubscriptionWhereInput }, infoOrQuery?: GraphQLResolveInfo | string) => Promise<AsyncIterator<UserSubscriptionPayload>>
}

export class Prisma extends BasePrisma {
  
  constructor({ endpoint, secret, fragmentReplacements, debug }: BasePrismaOptions) {
    super({ typeDefs, endpoint, secret, fragmentReplacements, debug });
  }

  exists = {
    User: (where: UserWhereInput): Promise<boolean> => super.existsDelegate('query', 'users', { where }, {}, '{ id }')
  }

  query: Query = {
    users: (args, info): Promise<User[]> => super.delegate('query', 'users', args, {}, info),
    user: (args, info): Promise<User | null> => super.delegate('query', 'user', args, {}, info),
    usersConnection: (args, info): Promise<UserConnection> => super.delegate('query', 'usersConnection', args, {}, info),
    node: (args, info): Promise<Node | null> => super.delegate('query', 'node', args, {}, info)
  }

  mutation: Mutation = {
    createUser: (args, info): Promise<User> => super.delegate('mutation', 'createUser', args, {}, info),
    updateUser: (args, info): Promise<User | null> => super.delegate('mutation', 'updateUser', args, {}, info),
    deleteUser: (args, info): Promise<User | null> => super.delegate('mutation', 'deleteUser', args, {}, info),
    upsertUser: (args, info): Promise<User> => super.delegate('mutation', 'upsertUser', args, {}, info),
    updateManyUsers: (args, info): Promise<BatchPayload> => super.delegate('mutation', 'updateManyUsers', args, {}, info),
    deleteManyUsers: (args, info): Promise<BatchPayload> => super.delegate('mutation', 'deleteManyUsers', args, {}, info)
  }

  subscription: Subscription = {
    user: (args, infoOrQuery): Promise<AsyncIterator<UserSubscriptionPayload>> => super.delegateSubscription('user', args, {}, infoOrQuery)
  }
}