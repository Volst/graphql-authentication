import { GraphQLResolveInfo } from 'graphql';

type Resolver<Result, Args = any> = (
  parent: any,
  args: Args,
  context: any,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export type DateTime = Date | string;

export interface Query {
  currentUser?: User | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  inviteAccepted: boolean;
  emailConfirmed: boolean;
  deletedAt?: DateTime | null;
  lastLogin?: DateTime | null;
  joinedAt: DateTime;
  isSuper: boolean;
}

export interface Mutation {
  signupByInvite: AuthPayload;
  signup: AuthPayload;
  confirmEmail: AuthPayload;
  inviteUser: UserIdPayload;
  login: AuthPayload;
  changePassword: UserIdPayload;
  updateCurrentUser?: User | null;
  triggerPasswordReset: TriggerPasswordResetPayload;
  passwordReset: UserIdPayload;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface UserIdPayload {
  id: string;
}

export interface TriggerPasswordResetPayload {
  ok: boolean;
}

export namespace QueryResolvers {
  export interface Resolvers {
    currentUser?: CurrentUserResolver;
  }

  export type CurrentUserResolver = Resolver<User | null>;
}

export namespace UserResolvers {
  export interface Resolvers {
    id?: IdResolver;
    email?: EmailResolver;
    name?: NameResolver;
    inviteAccepted?: InviteAcceptedResolver;
    emailConfirmed?: EmailConfirmedResolver;
    deletedAt?: DeletedAtResolver;
    lastLogin?: LastLoginResolver;
    joinedAt?: JoinedAtResolver;
    isSuper?: IsSuperResolver;
  }

  export type IdResolver = Resolver<string>;
  export type EmailResolver = Resolver<string>;
  export type NameResolver = Resolver<string>;
  export type InviteAcceptedResolver = Resolver<boolean>;
  export type EmailConfirmedResolver = Resolver<boolean>;
  export type DeletedAtResolver = Resolver<DateTime | null>;
  export type LastLoginResolver = Resolver<DateTime | null>;
  export type JoinedAtResolver = Resolver<DateTime>;
  export type IsSuperResolver = Resolver<boolean>;
}

export namespace MutationResolvers {
  export interface Resolvers {
    signupByInvite?: SignupByInviteResolver;
    signup?: SignupResolver;
    confirmEmail?: ConfirmEmailResolver;
    inviteUser?: InviteUserResolver;
    login?: LoginResolver;
    changePassword?: ChangePasswordResolver;
    updateCurrentUser?: UpdateCurrentUserResolver;
    triggerPasswordReset?: TriggerPasswordResetResolver;
    passwordReset?: PasswordResetResolver;
  }

  export type SignupByInviteResolver = Resolver<
    AuthPayload,
    SignupByInviteArgs
  >;
  export interface SignupByInviteArgs {
    data: SignupByInviteInput;
  }

  export type SignupResolver = Resolver<AuthPayload, SignupArgs>;
  export interface SignupArgs {
    data: SignupInput;
  }

  export type ConfirmEmailResolver = Resolver<AuthPayload, ConfirmEmailArgs>;
  export interface ConfirmEmailArgs {
    email: string;
    emailConfirmToken: string;
  }

  export type InviteUserResolver = Resolver<UserIdPayload, InviteUserArgs>;
  export interface InviteUserArgs {
    data: InviteUserInput;
  }

  export type LoginResolver = Resolver<AuthPayload, LoginArgs>;
  export interface LoginArgs {
    email: string;
    password: string;
  }

  export type ChangePasswordResolver = Resolver<
    UserIdPayload,
    ChangePasswordArgs
  >;
  export interface ChangePasswordArgs {
    oldPassword: string;
    newPassword: string;
  }

  export type UpdateCurrentUserResolver = Resolver<
    User | null,
    UpdateCurrentUserArgs
  >;
  export interface UpdateCurrentUserArgs {
    data: UserUpdateInput;
  }

  export type TriggerPasswordResetResolver = Resolver<
    TriggerPasswordResetPayload,
    TriggerPasswordResetArgs
  >;
  export interface TriggerPasswordResetArgs {
    email: string;
  }

  export type PasswordResetResolver = Resolver<
    UserIdPayload,
    PasswordResetArgs
  >;
  export interface PasswordResetArgs {
    email: string;
    resetToken: string;
    password: string;
  }
}

export namespace AuthPayloadResolvers {
  export interface Resolvers {
    token?: TokenResolver;
    user?: UserResolver;
  }

  export type TokenResolver = Resolver<string>;
  export type UserResolver = Resolver<User>;
}

export namespace UserIdPayloadResolvers {
  export interface Resolvers {
    id?: IdResolver;
  }

  export type IdResolver = Resolver<string>;
}

export namespace TriggerPasswordResetPayloadResolvers {
  export interface Resolvers {
    ok?: OkResolver;
  }

  export type OkResolver = Resolver<boolean>;
}

export interface SignupByInviteInput {
  email: string;
  inviteToken: string;
  password: string;
  name: string;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface InviteUserInput {
  email: string;
}

export interface UserUpdateInput {
  email?: string | null;
  name?: string | null;
}
export interface SignupByInviteMutationArgs {
  data: SignupByInviteInput;
}
export interface SignupMutationArgs {
  data: SignupInput;
}
export interface ConfirmEmailMutationArgs {
  email: string;
  emailConfirmToken: string;
}
export interface InviteUserMutationArgs {
  data: InviteUserInput;
}
export interface LoginMutationArgs {
  email: string;
  password: string;
}
export interface ChangePasswordMutationArgs {
  oldPassword: string;
  newPassword: string;
}
export interface UpdateCurrentUserMutationArgs {
  data: UserUpdateInput;
}
export interface TriggerPasswordResetMutationArgs {
  email: string;
}
export interface PasswordResetMutationArgs {
  email: string;
  resetToken: string;
  password: string;
}
