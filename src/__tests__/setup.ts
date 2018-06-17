import { GraphQLServer } from 'graphql-yoga';
import { GraphQLClient } from 'graphql-request';
import { graphqlUserConfig, authQueries, authMutations } from '..';

const KEES_USER = {
  id: '2',
  name: 'Kees',
  email: 'kees@volst.nl'
};

export class FakeAdapter {
  findUserById(ctx: any, id: any, info?: any) {
    if (id === '2') {
      return KEES_USER;
    }
  }
}

// In nodejs run `require('jsonwebtoken').sign({ userId: '2' }, 'wherearemyshoes')`
const AUTH_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwiaWF0IjoxNTI5MjUxNjQ4fQ.Tw4a0CI3r_8GmyuO1v2aMonrQtKV9QFYnXoxQz0cyRQ';

let http: any;
export async function startServer() {
  if (http) {
    await http.close();
  }
  const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers: {
      Query: {
        ...authQueries
      },
      Mutation: {
        ...authMutations
      }
    },
    context: req => ({
      ...req,
      graphqlUser: graphqlUserConfig({
        secret: 'wherearemyshoes',
        adapter: new FakeAdapter() as any
      })
    })
  });

  http = await server.start({
    port: 0
  });
  const { port } = http.address();
  return `http://localhost:${port}/`;
}

export const clientWithAuth = uri =>
  new GraphQLClient(uri, {
    headers: {
      Authorization: `Bearer ${AUTH_KEY}`
    }
  });

export const client = uri => new GraphQLClient(uri);

// TODO: this workaround sucks
test('asdf', () => undefined);
