import { Prisma, User } from './generated/prisma';
import { GraphqlAuthenticationAdapter, ID } from 'graphql-authentication';

export class GraphqlAuthenticationPrismaAdapter
  implements GraphqlAuthenticationAdapter {
  prismaContextName = 'db';

  constructor(options: { prismaContextName?: string }) {
    if (options.prismaContextName) {
      this.prismaContextName = options.prismaContextName;
    }
  }

  private db(ctx: object) {
    const db: Prisma = ctx[this.prismaContextName];
    if (!db) {
      throw new Error(
        `The Prisma binding is not attached to the \`${
          this.prismaContextName
        }\` property on your context.`
      );
    }
    return db;
  }

  findUserById(ctx: object, id: ID, info?: any) {
    return this.db(ctx).query.user({ where: { id } }, info);
  }
  findUserByEmail(ctx: object, email: string, info?: any) {
    return this.db(ctx).query.user(
      {
        where: { email: email }
      },
      info
    );
  }
  userExistsByEmail(ctx: object, email: string) {
    return this.db(ctx).exists.User({ email });
  }
  private createUser(ctx: object, data: any) {
    return this.db(ctx).mutation.createUser({
      data
    });
  }
  createUserBySignup(ctx: object, data: any) {
    return this.createUser(ctx, data);
  }
  createUserByInvite(ctx: object, data: any) {
    return this.createUser(ctx, data);
  }
  private updateUser(ctx: object, userId: ID, data: any) {
    return this.db(ctx).mutation.updateUser({
      where: { id: userId },
      data
    });
  }
  updateUserConfirmToken(ctx: object, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserLastLogin(ctx: object, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserPassword(ctx: object, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserResetToken(ctx: object, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserInfo(ctx: object, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserCompleteInvite(ctx: object, userId: ID, data: any) {
    return this.updateUser(ctx, userId, data);
  }
}
