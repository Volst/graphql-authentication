# Prisma Auth

A very opinionated authorization package for [Prisma](https://www.prisma.io/), a GraphQL database API. It uses old-school email/password authentication.

**Features:**

* Signup with good ol' email/password and confirmation email
* Login
* Invite another user (sends email)
* Password reset
* Change password of current user
* Update current user info
* Put resolvers behind login

# Motivation

The examples in the Prisma repo have a very basic example on [how to do auth](https://github.com/graphcool/prisma/tree/master/examples/auth), but after that you’re on your own. You still need to build features like password reset and signup. **That’s a lot of boilerplate!** Nobody wants that.

The intention with this package is **to let you write as less authentication-related code as possible**, while being flexible enough to support different use cases like open sign up, invitation-only signup, extra fields on the User model etc.

> If this package is too opinionated for you, you could still copy/paste parts of it in your application!

# Install

Node v8+ should be used. Install with Yarn or npm:

```
yarn add @volst/prisma-auth email-templates
npm i @volst/prisma-auth email-templates
```

# Usage

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

# Documentation

## GraphQL endpoints

Mutations:

- `signUpByInvite`
- `signup`
- `confirmEmail`
- `inviteUser`
- `login`
- `changePassword`
- `updateCurrentUser`
- `trigerPasswordReset`
- `passwordReset`

Queries:

- `currentUser`

For more details take a look at [schema.graphql](./schema.graphql).

## Helper utilities

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

## Login and session handling

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

## Adding custom fields to the User type

If you wish to expose some fields on the User type that are not exposed in our [schema.graphql](./schema.graphql), you can provide your own User. In your own `schema.graphql`, do something like the following:

```graphql
# import Mutation.* from "node_modules/@volst/prisma-auth/schema.graphql"

type Query {
  currentUser: User
}

type User {
  id: ID!
  email: String!
  name: String!
  inviteAccepted: Boolean!
  emailConfirmed: Boolean!
  deletedAt: DateTime
  isSuper: Boolean!
  # And finally, our custom field:
  isWillingToDance: Boolean!
}
```

> `extend type User` would save some copy/pasta here, but unfortunately that doesn't work yet in `graphql-js`. [More info](https://github.com/graphcool/graphql-import/issues/42#issuecomment-357693183).

## Signup only by invite

By default everyone can signup for your project. But what if you want to only allow invite by signup? In this case you need to leave out the `Mutation.signup` import. Example:

```graphql
# import Mutation.signupByInvite, Mutation.inviteUser, Mutation.login, Mutation.changePassword, Mutation.updateCurrentUser, Mutation.triggerPasswordReset, Mutation.passwordReset, from "node_modules/@volst/prisma-auth/schema.graphql"
```
