import * as jwt from 'jsonwebtoken';
import { IGraphqlAuthenticationConfig } from './Config';
import { ID } from './Adapter';

export interface Context {
  graphqlAuthentication: IGraphqlAuthenticationConfig;
  request?: any;
  req?: any;
}

function _getUserId(ctx: Context): string {
  // For Apollo Server 2.0+ it is ctx.req and for GraphQL Yoga ctx.request. Maybe there is a better way...
  const Authorization = (ctx.req || ctx.request).get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, ctx.graphqlAuthentication.secret) as {
      userId: ID;
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
  return ctx.graphqlAuthentication.adapter.findUserById(ctx, getUserId(ctx));
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

export function isAuthResolver(parent: any, args: any, ctx: Context) {
  return !!_getUserId(ctx);
}
