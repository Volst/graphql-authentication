import * as jwt from 'jsonwebtoken';
import { Prisma } from './generated/prisma';
import { forwardTo as pForwardTo } from 'prisma-binding';
import { IPrismaAuthConfig } from './Config';

export interface Context {
  db: Prisma;
  prismaAuth: IPrismaAuthConfig;
  request: any;
}

export function getUserId(ctx: Context): string {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, ctx.prismaAuth.secret) as {
      userId: string;
    };
    return userId;
  }

  throw new AuthError();
}

export function getUser(ctx: Context): Promise<any> {
  return ctx.db.query.user({ where: { id: getUserId(ctx) } });
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

// TODO: we might want to add some parameters to easily add permissions or whatever.
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
