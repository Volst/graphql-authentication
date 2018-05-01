import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { Prisma } from '../src/generated/prisma';
import { Context } from './utils';
import { authQueries, authMutations, PrismaAuthConfig } from '../src';

const resolvers = {
  Query: {
    ...authQueries
  },
  Mutation: {
    ...authMutations
  }
};

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'http://localhost:4466',
      debug: true
    }),
    prismaAuth: new PrismaAuthConfig({})
  })
});
server.start(() => console.log('Server is running on http://localhost:4000'));
