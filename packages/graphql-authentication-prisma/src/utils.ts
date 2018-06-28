import { forwardTo as pForwardTo } from 'prisma-binding';
import { getUserId, Context } from 'graphql-authentication';

/**
 * @deprecated Use prisma-binding's forwardTo('db') method instead in combination with graphql-shield to handle permissions.
 */
export function forwardTo({
  unauthorized,
  bindingName
}: {
  unauthorized?: boolean;
  bindingName?: string;
}) {
  return (parent: any, args: any, ctx: Context, info: any) => {
    if (!unauthorized) {
      getUserId(ctx);
    }
    return pForwardTo(bindingName || 'db')(parent, args, ctx, info);
  };
}
