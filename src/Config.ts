import * as Email from 'email-templates';
import { User } from './generated/prisma';
import { Context } from './utils';

export interface IPrismaAuthConfig {
  mailer?: Email;
  mailAppUrl?: string;
  secret: string;
  requiredConfirmedEmailForLogin?: boolean;
  hookInviteUserPostCreate?: (
    data: any,
    ctx: Context,
    user: User
  ) => Promise<any>;
}

// Yup, doing this only for static type checking...
// However one day we might want to check some options at compile time
export function prismaAuthConfig(options: IPrismaAuthConfig) {
  const defaults = {
    requiredConfirmedEmailForLogin: false
  };
  return Object.assign(defaults, options);
}
