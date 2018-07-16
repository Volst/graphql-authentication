import { GraphQLServer } from 'graphql-yoga';
import * as Email from 'email-templates';
import {
  authQueries,
  authMutations,
  graphqlAuthenticationConfig
} from 'graphql-authentication';
import { GraphqlAuthenticationTypeOrmAdapter } from './TypeOrmAdapter';

const resolvers = {
  Query: {
    ...authQueries,
    timeline() {
      return [{ name: 'Testje' }];
    }
  },
  Mutation: {
    ...authMutations
  }
};

const mailer = new Email({
  message: {
    from: 'info@volst.nl'
  }
});

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    graphqlAuthentication: graphqlAuthenticationConfig({
      adapter: new GraphqlAuthenticationTypeOrmAdapter(),
      secret: 'wherearemyshoes',
      mailer,
      mailAppUrl: 'http://example.com'
    })
  })
});
server.start(() => console.log('Server is running on http://localhost:4000'));
