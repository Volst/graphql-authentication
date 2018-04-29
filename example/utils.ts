import { Prisma } from '../src/generated/prisma';

export interface Context {
  db: Prisma;
  request: any;
}
