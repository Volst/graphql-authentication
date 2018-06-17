import { getUserId, Context } from './utils';

export const queries = {
  currentUser(parent: any, args: any, ctx: Context, info: any) {
    const id = getUserId(ctx);
    return ctx.graphqlUser.adapter.findUserById(ctx, id, info);
  }
};
