import { getUserId, Context, forwardTo } from './utils';
import { GraphQLResolveInfo } from 'graphql';
import { User } from './generated/prisma';

export function queries() {
  return {
    currentUser(parent: any, args: any, ctx: Context, info: any) {
      const id = getUserId(ctx);
      return ctx.db.query.user({ where: { id } }, info);
    }
  };
}
