import * as Email from 'email-templates';
import { User } from './generated/prisma';
import { Context } from './utils';
import { GraphqlUserPrismaAdapter } from './adapter/Prisma';

export interface IGraphqlUserConfig {
  mailer?: Email;
  mailAppUrl?: string;
  secret: string;
  requiredConfirmedEmailForLogin?: boolean;
  hookInviteUserPostCreate?: (
    data: any,
    ctx: Context,
    user: User
  ) => Promise<any>;
  adapter: GraphqlUserPrismaAdapter;
}

export function graphqlUserConfig(options: IGraphqlUserConfig) {
  const defaults = {
    requiredConfirmedEmailForLogin: false,
    adapter: new GraphqlUserPrismaAdapter()
  };
  return Object.assign(defaults, options);
}
