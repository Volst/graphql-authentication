import { makeBindingClass, Options } from 'graphql-binding';
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import { IResolvers } from 'graphql-tools/dist/Interfaces';
import schema from './schema';

export interface Query {
  currentUser: <T = User | null>(
    args?: {},
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
}

export interface Mutation {
  signupByInvite: <T = AuthPayload>(
    args: { data: SignupByInviteInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  signup: <T = AuthPayload>(
    args: { data: SignupInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  confirmEmail: <T = AuthPayload>(
    args: { email: String; emailConfirmToken: String },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  inviteUser: <T = UserIdPayload>(
    args: { data: InviteUserInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  login: <T = AuthPayload>(
    args: { email: String; password: String },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  changePassword: <T = UserIdPayload>(
    args: { oldPassword: String; newPassword: String },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateCurrentUser: <T = User | null>(
    args: { data: UserUpdateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  triggerPasswordReset: <T = TriggerPasswordResetPayload>(
    args: { email: String },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  passwordReset: <T = UserIdPayload>(
    args: { email: String; resetToken: String; password: String },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
}

export interface Subscription {}

export interface Binding {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
  request: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;
  delegate(
    operation: 'query' | 'mutation',
    fieldName: string,
    args: {
      [key: string]: any;
    },
    infoOrQuery?: GraphQLResolveInfo | string,
    options?: Options
  ): Promise<any>;
  delegateSubscription(
    fieldName: string,
    args?: {
      [key: string]: any;
    },
    infoOrQuery?: GraphQLResolveInfo | string,
    options?: Options
  ): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new (...args): T;
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({
  schema
});

/**
 * Types
 */

export interface SignupByInviteInput {
  email: String;
  inviteToken: String;
  password: String;
  name: String;
}

export interface SignupInput {
  email: String;
  password: String;
  name: String;
}

export interface InviteUserInput {
  email: String;
}

export interface UserUpdateInput {
  email?: String;
  name?: String;
}

export interface AuthPayload {
  token: String;
  user: User;
}

export interface TriggerPasswordResetPayload {
  ok: Boolean;
}

export interface User {
  id: ID_Output;
  email: String;
  name: String;
  inviteAccepted: Boolean;
  emailConfirmed: Boolean;
  deletedAt?: DateTime;
  lastLogin?: DateTime;
  joinedAt: DateTime;
  isSuper: Boolean;
}

export interface UserIdPayload {
  id: ID_Output;
}

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

export type DateTime = Date | string;

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;
