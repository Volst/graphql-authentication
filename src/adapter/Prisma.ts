import { Context as _Context } from '../utils';
import { Prisma, User } from '../generated/prisma';
import { GraphqlUserAdapter, ID } from '../Adapter';

interface Context extends _Context {
  db?: Prisma;
}

export class GraphqlUserPrismaAdapter implements GraphqlUserAdapter {
  private db(ctx: Context) {
    if (!ctx.db) {
      throw new Error(
        'The Prisma binding is not attached to the `db` property on your context.'
      );
    }
    return ctx.db;
  }

  findUserById(ctx: Context, id: ID, info?: any) {
    return this.db(ctx).query.user({ where: { id } }, info);
  }
  findUserByEmail(ctx: Context, email: string, info?: any) {
    return this.db(ctx).query.user(
      {
        where: { email: email }
      },
      info
    );
  }
  userExistsByEmail(ctx: Context, email: string) {
    return this.db(ctx).exists.User({ email });
  }
  private createUser(ctx: Context, data: any) {
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
  private updateUser(ctx: Context, userId: ID, data: any) {
    return this.db(ctx).mutation.updateUser({
      where: { id: userId },
      data
    });
  }
  updateUserConfirmToken(ctx: Context, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserLastLogin(ctx: Context, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserPassword(ctx: Context, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserResetToken(ctx: Context, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserInfo(ctx: Context, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserCompleteInvite(ctx: Context, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
}
