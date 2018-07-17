const { GraphQLServer } = require('graphql-yoga');
const {
  authQueries,
  authMutations,
  graphqlAuthenticationConfig
} = require('graphql-authentication');
const { GraphqlAuthenticationInMemoryAdapter } = require('./InMemoryAdapter');
const { email } = require('./email');

const adapter = new GraphqlAuthenticationInMemoryAdapter();

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
    graphqlAuthentication: graphqlAuthenticationConfig({
      adapter,
      secret: 'wherearemyshoes',
      mailer: email,
      mailAppUrl: 'http://example.com'
    })
  })
});

server.start(() => console.log('Server is running on http://localhost:4000'));
