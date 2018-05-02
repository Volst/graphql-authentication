# Prisma Auth

A very opinionated authorization package for [Prisma](https://www.prisma.io/), a GraphQL database API. It uses old-school email/password authentication. The intention is to let you write as less authentication-related code as possible and let you go on with your application, while being flexible enough to support different use cases (open sign up, invitation-only signup, extra fields on the User model).

**Experimental, but should work.**

**Features:**

* Signup with email/password
* Login
* Invite another user
* Password reset
* Change password of current user
* Update current user info
* Put resolvers behind login

## Install

```
yarn add @volst/prisma-auth
npm i @volst/prisma-auth
```

## Usage

In your Prisma `datamodel.graphql` file, add this [User model](./example/datamodel.graphql).

In your `schema.graphql` for your own server, add something like the following (you can also import specific endpoints only):

```graphql
# import Query.*, Mutation.* from "node_modules/@volst/prisma-auth/schema.graphql"
```

In your server we now need to map these types to resolvers and pass in some options. The following example uses [graphql-yoga](https://github.com/graphcool/graphql-yoga/), but it should also work with Apollo Server.

```js
import { authQueries, authMutations, PrismaAuthConfig } from '../src';
import * as Email from 'email-templates';

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
    db: new Prisma({...}),
    prismaAuth: prismaAuthConfig({
      // Required, used for signing JWT tokens
      secret: 'wheredidthesodago',
      // Optional, for sending emails with email-templates (https://www.npmjs.com/package/email-templates)
      mailer: Email(),
      // Optional, the URL to your frontend which is used in emails
      mailAppUrl: 'http://example.com',
    })
  })
});
```

## Documentation

### GraphQL endpoints

Mutations:

- `signUpByInvite`
- `signup`
- `inviteUser`
- `login`
- `changePassword`
- `updateCurrentUser`
- `trigerPasswordReset`
- `passwordReset`

Queries:

- `currentUser`

For more details take a look at [schema.graphql](./schema.graphql).

### Helper utilities

Get the current user in a resolver:

```js
import { getUser } from '@volst/prisma-auth';

const Mutation = {
  async publish(parent, data, ctx) {
    const user = await getUser(ctx);
    console.log('User', user.email);
  }
};
```

Forward a resolver directly to Prisma, and require that the user is logged in:

```js
import { forwardTo } from '@volst/prisma-auth';

const Mutation = {
  publish: forwardTo()
};
```

### Login and session handling

[JWT tokens](https://jwt.io/) are used to handle sessions. In the frontend you can perform a login like this:

```graphql
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user { # optional
      name
    }
  }
}
```

And then save the token to `localStorage`. Now you need to send the token with every request. If you are using Apollo, [the documentation](https://www.apollographql.com/docs/react/recipes/authentication.html#Header) has a great example on how to do this.
