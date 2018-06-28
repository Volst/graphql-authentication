import { Context } from './utils';

export type DateTime = Date | string;
export type ID = string;

export interface User {
  id: ID;
  email: string;
  password: string;
  name: string;
  inviteToken?: string;
  inviteAccepted: Boolean;
  emailConfirmed: Boolean;
  emailConfirmToken?: string;
  resetToken?: string;
  resetExpires?: DateTime;
  deletedAt?: DateTime;
  lastLogin?: DateTime;
  joinedAt: DateTime;
  isSuper: Boolean;
}

export interface GraphqlAuthenticationAdapter {
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
