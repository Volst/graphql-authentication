const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const Email = require('email-templates');
const {
  authQueries,
  authMutations,
  graphqlAuthenticationConfig
} = require('graphql-authentication');
const { GraphqlAuthenticationSequelizeAdapter } = require('./SequelizeAdapter');

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
  },
  views: {
    root: path.join(__dirname, 'emails')
  }
});

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    graphqlAuthentication: graphqlAuthenticationConfig({
      adapter: new GraphqlAuthenticationSequelizeAdapter(),
      secret: 'wherearemyshoes',
      mailer,
      mailAppUrl: 'http://example.com'
    })
  })
});
server.start(() => console.log('Server is running on http://localhost:4000'));
