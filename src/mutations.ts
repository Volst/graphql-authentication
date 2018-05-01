import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as validator from 'validator';
import * as uuidv4 from 'uuid/v4';
import { getUser, Context, forwardTo } from './utils';
import { User, UserUpdateInput } from './generated/prisma';
import { GraphQLResolveInfo } from 'graphql';
import * as Email from 'email-templates';

function generateToken(user: User) {
  return jwt.sign({ userId: user.id }, process.env.BACKEND_APP_SECRET || '');
}

function validatePassword(value: string) {
  if (value.length <= 8) {
    throw new Error('Password too short');
  }
}

function getHashedPassword(value: string) {
  return bcrypt.hash(value, 10);
}

export const mutations = {
  async signupByInvite(
    parent: any,
    { email, inviteToken, password, name }: User,
    ctx: Context
  ) {
    // Important first check, because i.e. the `inviteToken` could be an empty string
    // and in that case the find query beneath would find any user with any given email,
    // allowing you to change the password of everybody.
    if (!inviteToken || !email) {
      throw new Error('Forgot email or inviteToken');
    }
    const user = await ctx.db.query.user({
      where: { email }
    });
    if (!user) {
      throw new Error(`No user found for given email`);
    }
    if (user.inviteToken !== inviteToken || user.inviteAccepted) {
      throw new Error('Invite token invalid');
    }

    validatePassword(password);
    const hashedPassword = await getHashedPassword(password);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        name,
        inviteToken: '',
        inviteAccepted: true,
        password: hashedPassword
      }
    });

    return {
      token: generateToken(user),
      user: updatedUser
    };
  },

  async signup(parent: any, { email, password, name }: User, ctx: Context) {
    if (!email) {
      throw new Error('Forgot email');
    }
    const user = await ctx.db.query.user({
      where: { email }
    });
    if (user) {
      throw new Error(`User already exists.`);
    }

    validatePassword(password);
    const hashedPassword = await getHashedPassword(password);

    const newUser = await ctx.db.mutation.createUser({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return {
      token: generateToken(newUser),
      user: newUser
    };
  },

  async login(parent: any, { email, password }: User, ctx: Context) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error('No user found for email');
    }

    if (!user.inviteAccepted) {
      throw new Error('User has not accepted invite yet');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    return {
      token: generateToken(user),
      user
    };
  },

  async changePassword(
    parent: any,
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    ctx: Context
  ) {
    const user = await getUser(ctx);

    const valid = await bcrypt.compare(user.password, oldPassword);
    if (!valid) {
      throw new Error('Invalid password');
    }

    validatePassword(newPassword);
    const password = await getHashedPassword(newPassword);

    const newUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: { password }
    });

    return {
      id: newUser!.id
    };
  },

  async inviteUser(
    parent: any,
    {
      data
    }: {
      data: {
        email: string;
      };
    },
    ctx: Context
  ) {
    await getUser(ctx);

    if (!validator.isEmail(data.email)) {
      throw new Error('Not a valid email');
    }

    const existingUser = await ctx.db.query.user({
      where: { email: data.email }
    });
    if (existingUser) {
      if (ctx.prismaAuth.hookInviteUserPostCreate) {
        await ctx.prismaAuth.hookInviteUserPostCreate(data, ctx, existingUser);
      }
      return {
        id: existingUser.id
      };
    }

    // This token will be used in the email to the user.
    // According to https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
    // uuid v4 is safe to be used as random token generator.
    const inviteToken = uuidv4();

    const newUser = await ctx.db.mutation.createUser({
      data: {
        email: data.email,
        inviteToken,
        inviteAccepted: false,
        password: '',
        name: ''
      }
    });

    if (ctx.prismaAuth.hookInviteUserPostCreate) {
      await ctx.prismaAuth.hookInviteUserPostCreate(data, ctx, newUser);
    }

    if (ctx.prismaAuth.mailer) {
      ctx.prismaAuth.mailer.send({
        template: 'inviteUser',
        message: {
          to: newUser.email
        },
        locals: {
          mailAppUrl: ctx.prismaAuth.mailAppUrl,
          inviteToken,
          email: newUser.email
        }
      });
    }

    return {
      id: newUser.id
    };
  },

  async triggerPasswordReset(parent: any, { email }: User, ctx: Context) {
    if (!validator.isEmail(email)) {
      throw new Error('Not a valid email');
    }

    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      return { ok: true };
    }

    // This token will be used in the email to the user.
    // According to https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
    // uuid v4 is safe to be used as random token generator.
    const resetToken = uuidv4();
    const now = new Date();
    // Expires in two hours
    const resetExpires = new Date(now.getTime() + 7200000).toISOString();

    await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: { resetToken, resetExpires }
    });

    if (ctx.prismaAuth.mailer) {
      ctx.prismaAuth.mailer.send({
        template: 'passwordReset',
        message: {
          to: user.email
        },
        locals: { mailAppUrl: ctx.prismaAuth.mailAppUrl, resetToken, email }
      });
    }

    return {
      ok: true
    };
  },

  async passwordReset(
    parent: any,
    { email, resetToken, password }: User,
    ctx: Context
  ) {
    if (!resetToken || !password) {
      throw new Error('Forgot password or resetToken');
    }
    const user = await ctx.db.query.user({
      where: { email }
    });
    if (!user || !user.resetExpires || user.resetToken !== resetToken) {
      throw new Error(`No user found for given resetToken`);
    }
    if (new Date() > new Date(user.resetExpires)) {
      throw new Error('resetToken expired');
    }

    validatePassword(password);
    const hashedPassword = await getHashedPassword(password);

    await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: '',
        resetExpires: undefined
      }
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

    await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data
    });

    return user;
  }
};
