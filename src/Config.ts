import * as Email from 'email-templates';
import { User } from './generated/prisma';
import { Context } from './utils';

export interface IConfig {
  mailer?: Email;
  mailAppUrl?: string;
  hookInviteUserPostCreate?: (
    data: any,
    ctx: Context,
    user: User
  ) => Promise<any>;
}

export class PrismaAuthConfig {
  constructor(options: IConfig) {
    Object.assign(this, options);
  }
  // There most probably is a better way to do this...
  mailer: IConfig['mailer'];
  mailAppUrl: IConfig['mailAppUrl'];
  hookInviteUserPostCreate: IConfig['hookInviteUserPostCreate'];
}
