import { Context } from '../utils';

export class GraphqlUserPrismaAdapter {
  findUserById(ctx: Context, id: string, info?: any) {
    return ctx.db.query.user({ where: { id } }, info);
  }
  findUserByEmail(ctx: Context, email: string) {
    return ctx.db.query.user({
      where: { email: email }
    });
  }
  userExistsByEmail(ctx: Context, email: string) {
    return ctx.db.exists.User({ email });
  }
  createUser(ctx: Context, data: any) {
    return ctx.db.mutation.createUser({
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
    return ctx.db.mutation.updateUser({
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
