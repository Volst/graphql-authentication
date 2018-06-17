import * as jwt from 'jsonwebtoken';
import { forwardTo as pForwardTo } from 'prisma-binding';
import { IGraphqlUserConfig } from './Config';

export interface Context {
  graphqlUser: IGraphqlUserConfig;
  request: any;
}

function _getUserId(ctx: Context): string {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, ctx.graphqlUser.secret) as {
      userId: string;
    };
    return userId;
  }
  return '';
}

export function getUserId(ctx: Context): string {
  const userId = _getUserId(ctx);
  if (userId) {
    return userId;
  }
  throw new AuthError();
}

export function getUser(ctx: Context): Promise<any> {
  return ctx.graphqlUser.adapter.findUserById(ctx, getUserId(ctx));
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

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

export function isAuthResolver(parent: any, args: any, ctx: Context) {
  return !!_getUserId(ctx);
}
