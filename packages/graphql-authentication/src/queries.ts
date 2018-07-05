import { getUserId, Context } from './utils';
// Without this manual User interface import, TypeScript will create an incorrect queries.d.ts declaration file, WTF?
import { User } from './Adapter';

export const queries = {
  currentUser(parent: any, args: any, ctx: Context, info: any) {
    const id = getUserId(ctx);
    return ctx.graphqlAuthentication.adapter.findUserById(ctx, id, info);
  }
};
