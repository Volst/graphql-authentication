import { GraphQLServer } from 'graphql-yoga';
import { GraphQLClient } from 'graphql-request';
import { graphqlAuthenticationConfig, authQueries, authMutations } from '..';
import { GraphqlAuthenticationAdapter, User, ID } from '..';

export class FakeAdapter implements GraphqlAuthenticationAdapter {
  users: User[] = [
    {
      id: '2',
      name: 'Kees',
      password: '$2a$10$3dcRen7qMwJmzUzgj7cjUukHYlPTTCAjFhfF00.5WAFhhClTp6H4y', // testtest2
      email: 'kees@volst.nl',
      inviteAccepted: true,
      emailConfirmed: true,
      joinedAt: '2018-06-29T14:26:57+00:00',
      isSuper: false,
      lastLogin: ''
    }
  ];

  // If you'd use a database you wouldn't need this
  _generateId() {
    const lastUser = this.users[this.users.length - 1];
    return String(parseInt(lastUser.id) + 1);
  }
  findUserById(ctx: object, id: ID, info?: any) {
    return Promise.resolve(this.users.find(user => user.id === id) || null);
  }
  findUserByEmail(ctx: any, email: string) {
    return Promise.resolve(
      this.users.find(user => user.email === email) || null
    );
  }
  userExistsByEmail(ctx: any, email: string) {
    return Promise.resolve(this.users.some(user => user.email === email));
  }
  createUserBySignup(ctx: any, data: any) {
    const lastUser = this.users[this.users.length - 1];
    const user = { id: this._generateId(), ...data };
    this.users.push(user);
    return user;
  }
  async updateUserLastLogin(ctx: any, userId: string, data: any) {
    const user = await this.findUserById(ctx, userId);
    Object.assign(user, data); // iel
    return Promise.resolve(user);
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
      graphqlAuthentication: graphqlAuthenticationConfig({
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
