import { Context } from './utils';

export type DateTime = Date | string;
export type ID = string;

export interface User {
  id: ID;
  email: String;
  password: String;
  name: String;
  inviteToken?: String;
  inviteAccepted: Boolean;
  emailConfirmed: Boolean;
  emailConfirmToken?: String;
  resetToken?: String;
  resetExpires?: DateTime;
  deletedAt?: DateTime;
  lastLogin?: DateTime;
  joinedAt: DateTime;
  isSuper: Boolean;
}

export interface GraphqlUserAdapter {
  findUserById(ctx: Context, id: ID, info?: any): Promise<User | null>;
  findUserByEmail(
    ctx: Context,
    email: string,
    info?: any
  ): Promise<User | null>;
  userExistsByEmail(ctx: Context, email: string): Promise<boolean>;
  createUserBySignup(ctx: Context, data: any): Promise<User>;
  createUserByInvite(ctx: Context, data: any): Promise<User>;
  updateUserConfirmToken(
    ctx: Context,
    userId: ID,
    data: any
  ): Promise<User | null>;
  updateUserLastLogin(
    ctx: Context,
    userId: ID,
    data: any
  ): Promise<User | null>;
  updateUserPassword(ctx: Context, userId: ID, data: any): Promise<User | null>;
  updateUserResetToken(
    ctx: Context,
    userId: ID,
    data: any
  ): Promise<User | null>;
  updateUserInfo(ctx: Context, userId: ID, data: any): Promise<User | null>;
  updateUserCompleteInvite(
    ctx: Context,
    userId: ID,
    data: any
  ): Promise<User | null>;
}
