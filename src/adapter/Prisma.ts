import { Context as _Context } from '../utils';
import { Prisma } from '../generated/prisma';

interface Context extends _Context {
  db?: Prisma;
}

export class GraphqlUserPrismaAdapter {
  private db(ctx: Context) {
    if (!ctx.db) {
      throw new Error(
        'The Prisma binding is not attached to the `db` property on your context.'
      );
    }
    return ctx.db;
  }

  findUserById(ctx: Context, id: string, info?: any) {
    return this.db(ctx).query.user({ where: { id } }, info);
  }
  findUserByEmail(ctx: Context, email: string) {
    return this.db(ctx).query.user({
      where: { email: email }
    });
  }
  userExistsByEmail(ctx: Context, email: string) {
    return this.db(ctx).exists.User({ email });
  }
  createUser(ctx: Context, data: any) {
    return this.db(ctx).mutation.createUser({
      data
    });
  }
  createUserBySignup(ctx: Context, data: any) {
    return this.createUser(ctx, data);
  }
  createUserByInvite(ctx: Context, data: any) {
    return this.createUser(ctx, data);
  }
  updateUser(ctx: Context, userId: string, data: any) {
    return this.db(ctx).mutation.updateUser({
      where: { id: userId },
      data
    });
  }
  updateUserConfirmToken(ctx: Context, userId: string, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserLastLogin(ctx: Context, userId: string, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserPassword(ctx: Context, userId: string, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserResetToken(ctx: Context, userId: string, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserInfo(ctx: Context, userId: string, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserCompleteInvite(ctx: Context, userId: string, data: any) {
    return this.updateUser(ctx, userId, data);
  }
}
