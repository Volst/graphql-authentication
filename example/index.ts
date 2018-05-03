import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from '../src/generated/prisma';
import { authQueries, authMutations, prismaAuthConfig } from '../src';
import * as Email from 'email-templates';

const resolvers = {
  Query: {
    ...authQueries
  },
  Mutation: {
    ...authMutations
  }
};

const mailer = new Email({
  message: {
    from: 'info@volst.nl'
  },
  send: true
});

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'http://localhost:4466',
      debug: true
    }),
    prismaAuth: prismaAuthConfig({
      secret: 'wherearemyshoes',
      mailer
    })
  })
});
server.start(() => console.log('Server is running on http://localhost:4000'));
