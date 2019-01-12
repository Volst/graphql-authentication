import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as validator from 'validator';
import { v4 as uuid } from 'uuid';
import { getUser, Context } from './utils';
import { User } from './Adapter';
import {
  MissingDataError,
  ResetTokenExpiredError,
  InvalidEmailError,
  PasswordTooShortError,
  UserNotFoundError,
  IncorrectPasswordError,
  InvalidInviteTokenError,
  UserEmailExistsError,
  UserInviteNotAcceptedError,
  UserDeletedError,
  InvalidOldPasswordError,
  InvalidEmailConfirmToken,
  UserEmailUnconfirmedError
} from './errors';
import {
  SignupByInviteInput,
  SignupInput,
  InviteUserInput,
  UserUpdateInput
} from './binding';

function generateToken(user: User, ctx: Context) {
  return jwt.sign({ userId: user.id }, ctx.graphqlAuthentication.secret);
}

function validatePassword(ctx: Context, value: string) {
  if (!ctx.graphqlAuthentication.validatePassword!(value)) {
    throw new PasswordTooShortError();
  }
}

function getHashedPassword(value: string) {
  return bcrypt.hash(value, 10);
}

export const mutations = {
  async signupByInvite(
    parent: any,
    { data }: { data: SignupByInviteInput },
    ctx: Context
  ) {
    // Important first check, because i.e. the `inviteToken` could be an empty string
    // and in that case the find query beneath would find any user with any given email,
    // allowing you to change the password of everybody.
    if (!data.inviteToken || !data.email) {
      throw new MissingDataError();
    }
    const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(
      ctx,
      data.email
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    if (user.inviteToken !== data.inviteToken || user.inviteAccepted) {
      throw new InvalidInviteTokenError();
    }

    validatePassword(ctx, data.password);
    const hashedPassword = await getHashedPassword(data.password);

    const updatedUser = await ctx.graphqlAuthentication.adapter.updateUserCompleteInvite(
      ctx,
      user.id,
      {
        name: data.name,
        inviteToken: '',
        inviteAccepted: true,
        password: hashedPassword
      }
    );

    return {
      token: generateToken(user, ctx),
      user: updatedUser
    };
  },

  async signup(parent: any, { data }: { data: SignupInput }, ctx: Context) {
    if (!data.email) {
      throw new MissingDataError();
    }
    const userExists = await ctx.graphqlAuthentication.adapter.userExistsByEmail(
      ctx,
      data.email
    );
    if (userExists) {
      throw new UserEmailExistsError();
    }

    validatePassword(ctx, data.password);
    const hashedPassword = await getHashedPassword(data.password);
    const emailConfirmToken = uuid();

    const newUser = await ctx.graphqlAuthentication.adapter.createUserBySignup(
      ctx,
      {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        emailConfirmToken,
        emailConfirmed: false,
        inviteAccepted: true,
        joinedAt: new Date().toISOString()
      }
    );

    if (ctx.graphqlAuthentication.mailer) {
      ctx.graphqlAuthentication.mailer.send({
        template: 'signupUser',
        message: {
          to: newUser.email
        },
        locals: {
          mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
          emailConfirmToken,
          email: newUser.email
        }
      });
    }

    return {
      token: generateToken(newUser, ctx),
      user: newUser
    };
  },

  async confirmEmail(
    parent: any,
    { emailConfirmToken, email }: { emailConfirmToken: string; email: string },
    ctx: Context
  ) {
    if (!emailConfirmToken || !email) {
      throw new MissingDataError();
    }
    const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(
      ctx,
      email
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    if (user.emailConfirmToken !== emailConfirmToken || user.emailConfirmed) {
      throw new InvalidEmailConfirmToken();
    }

    const updatedUser = await ctx.graphqlAuthentication.adapter.updateUserConfirmToken(
      ctx,
      user.id,
      {
        emailConfirmToken: '',
        emailConfirmed: true
      }
    );

    return {
      token: generateToken(user, ctx),
      user: updatedUser
    };
  },

  async login(
    parent: any,
    { email, password }: { email: string; password: string },
    ctx: Context
  ) {
    const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(
      ctx,
      email
    );
    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.inviteAccepted) {
      throw new UserInviteNotAcceptedError();
    }

    if (user.deletedAt) {
      throw new UserDeletedError();
    }

    if (
      ctx.graphqlAuthentication.requiredConfirmedEmailForLogin &&
      !user.emailConfirmed
    ) {
      throw new UserEmailUnconfirmedError();
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new IncorrectPasswordError();
    }

    // Purposefully async, this update doesn't matter that much.
    ctx.graphqlAuthentication.adapter.updateUserLastLogin(ctx, user.id, {
      lastLogin: new Date().toISOString()
    });

    return {
      token: generateToken(user, ctx),
      user
    };
  },

  async changePassword(
    parent: any,
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    ctx: Context
  ) {
    const user = await getUser(ctx);

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw new InvalidOldPasswordError();
    }

    validatePassword(ctx, newPassword);
    const password = await getHashedPassword(newPassword);

    const newUser = await ctx.graphqlAuthentication.adapter.updateUserPassword(
      ctx,
      user.id,
      { password }
    );

    return {
      id: newUser!.id
    };
  },

  async inviteUser(
    parent: any,
    { data }: { data: InviteUserInput },
    ctx: Context
  ) {
    await getUser(ctx);

    if (!validator.isEmail(data.email)) {
      throw new InvalidEmailError();
    }

    const existingUser = await ctx.graphqlAuthentication.adapter.findUserByEmail(
      ctx,
      data.email
    );
    if (existingUser) {
      if (ctx.graphqlAuthentication.hookInviteUserPostCreate) {
        await ctx.graphqlAuthentication.hookInviteUserPostCreate(
          data,
          ctx,
          existingUser
        );
      }
      return {
        id: existingUser.id
      };
    }

    // This token will be used in the email to the user.
    // According to https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
    // uuid v4 is safe to be used as random token generator.
    const inviteToken = uuid();

    const newUser = await ctx.graphqlAuthentication.adapter.createUserByInvite(
      ctx,
      {
        email: data.email,
        inviteToken,
        inviteAccepted: false,
        password: '',
        name: '',
        joinedAt: new Date().toISOString()
      }
    );

    if (ctx.graphqlAuthentication.hookInviteUserPostCreate) {
      await ctx.graphqlAuthentication.hookInviteUserPostCreate(
        data,
        ctx,
        newUser
      );
    }

    if (ctx.graphqlAuthentication.mailer) {
      ctx.graphqlAuthentication.mailer.send({
        template: 'inviteUser',
        message: {
          to: newUser.email
        },
        locals: {
          mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
          inviteToken,
          email: newUser.email
        }
      });
    }

    return {
      id: newUser.id
    };
  },

  async triggerPasswordReset(
    parent: any,
    { email }: { email: string },
    ctx: Context
  ) {
    if (!validator.isEmail(email)) {
      throw new InvalidEmailError();
    }

    const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(
      ctx,
      email
    );
    if (!user) {
      return { ok: true };
    }

    // This token will be used in the email to the user.
    // According to https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
    // uuid v4 is safe to be used as random token generator.
    const resetToken = uuid();
    const now = new Date();
    // Expires in two hours
    const resetExpires = new Date(now.getTime() + 7200000).toISOString();

    await ctx.graphqlAuthentication.adapter.updateUserResetToken(ctx, user.id, {
      resetToken,
      resetExpires
    });

    if (ctx.graphqlAuthentication.mailer) {
      ctx.graphqlAuthentication.mailer.send({
        template: 'passwordReset',
        message: {
          to: user.email
        },
        locals: {
          mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
          resetToken,
          email
        }
      });
    }

    return {
      ok: true
    };
  },

  async passwordReset(
    parent: any,
    {
      email,
      resetToken,
      password
    }: { email: string; resetToken: string; password: string },
    ctx: Context
  ) {
    if (!resetToken || !password) {
      throw new MissingDataError();
    }
    const user = await ctx.graphqlAuthentication.adapter.findUserByEmail(
      ctx,
      email
    );
    if (!user || !user.resetExpires || user.resetToken !== resetToken) {
      throw new UserNotFoundError();
    }
    if (new Date() > new Date(user.resetExpires)) {
      throw new ResetTokenExpiredError();
    }

    validatePassword(ctx, password);
    const hashedPassword = await getHashedPassword(password);

    await ctx.graphqlAuthentication.adapter.updateUserResetToken(ctx, user.id, {
      resetToken: '',
      resetExpires: undefined
    });
    await ctx.graphqlAuthentication.adapter.updateUserPassword(ctx, user.id, {
      password: hashedPassword
    });

    return {
      id: user.id
    };
  },

  async updateCurrentUser(
    parent: any,
    { data }: { data: UserUpdateInput },
    ctx: Context
  ) {
    const user = await getUser(ctx);

    await ctx.graphqlAuthentication.adapter.updateUserInfo(ctx, user.id, data);

    return user;
  }
};
