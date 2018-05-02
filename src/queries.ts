import { getUserId, Context } from './utils';
import { User } from './generated/prisma';

export const queries = {
  currentUser(parent: any, args: any, ctx: Context, info: any) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  }
};
