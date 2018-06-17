# GraphQL User

A very opinionated user authentication package for [GraphQL](https://graphql.org/). It uses old-school email/password authentication.

By default GraphQL User has an adapter for [Prisma](https://www.prisma.io/), but you can use any data layer (e.g. an ORM) you want with it. Please write a PR with another adapter!

**Features:**

* Signup with good ol' email/password and confirmation email
* Login
* Invite another user (sends email)
* Password reset
* Change password of current user
* Update current user info
* Support for [graphql-shield](https://github.com/maticzav/graphql-shield) to deal with permissions

# Motivation

Adding user authentication seems simple; there are lots of examples on how to write a "login" and a "signup" resolver. You implement it in your own project and continue working. After a while you'll have users forgetting their password so you need to build that. Then you want to be able to invite users, so you'll build that. After a while you have a lot of boilerplate code related to user authentication.

The intention with this package is **to let you write as less user-related code as possible**, while being flexible enough to support different use cases like open sign up, invitation-only signup, extra fields on the User model etc.

> If this package is too opinionated for you, you could still copy/paste parts of it in your application!

# Install

Node v8+ should be used. Install with Yarn or npm:

```
yarn add graphql-user email-templates
npm i graphql-user email-templates
```

# Usage with Prisma

## Step 1

In your Prisma `datamodel.graphql` file, add this [User model](./example/datamodel.graphql).

## Step 2

In your `schema.graphql` for your own server, add something like the following (you can also import specific endpoints only):

```graphql
# import Query.*, Mutation.* from "node_modules/graphql-user/schema.graphql"
```

## Step 3

In your server we now need to map these types to resolvers and pass in some options. The following example uses [graphql-yoga](https://github.com/graphcool/graphql-yoga/), but it should also work with Apollo Server.

```js
import { authQueries, authMutations, graphqlUserConfig } from 'graphql-user';
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
    graphqlUser: graphqlUserConfig({
      // Required, used for signing JWT tokens
      secret: 'wheredidthesodago',
      // Optional, for sending emails with email-templates (https://www.npmjs.com/package/email-templates)
      mailer: new Email(),
      // Optional, the URL to your frontend which is used in emails
      mailAppUrl: 'http://example.com',
    })
  })
});
```

## Step 4

Lastly, if you want to send emails, you should copy the email templates to your own project. Checkout [the example email templates](./example/emails).

# Usage without Prisma

Since Prisma is just an adapter, it is possible to use any ORM or package you want to mutate and query your data.

```js
class GraphqlUserSequelizeAdapter {
  //
}

graphqlUser: GraphqlUserSequelizeAdapter({
  adapter: new GraphqlUser()
});
```

# Documentation

## GraphQL endpoints

Mutations:

* `signUpByInvite`
* `signup`
* `confirmEmail`
* `inviteUser`
* `login`
* `changePassword`
* `updateCurrentUser`
* `trigerPasswordReset`
* `passwordReset`

Queries:

* `currentUser`

For more details take a look at [schema.graphql](./schema.graphql).

## Authentication on endpoints

On some of your endpoints you might want to require that the user is logged in, or only allow the user to see the data if they have a specific role. A very powerful package exists for this, [graphql-shield](https://github.com/maticzav/graphql-shield):

```js
import { shield, rule } from 'graphql-shield';
import { isAuthResolver } from 'graphql-user';

const isAuth = rule()(isAuthResolver);

const permissions = shield({
  Mutation: {
    publish: isAuth
  }
});

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  middlewares: [permissions]
});
```

Take a look at the [graphql-shield README](https://github.com/maticzav/graphql-shield/blob/master/README.md) to find out more.

## Helper utilities

Get the current user in a resolver (performs a request to your data layer):

```js
import { getUser } from 'graphql-user';

const Mutation = {
  async publish(parent, data, ctx) {
    const user = await getUser(ctx);
    console.log('User', user.email);
  }
};
```

Get only the current user ID in a resolver (without request to your data layer):

```js
import { getUserId } from 'graphql-user';

const Mutation = {
  async publish(parent, data, ctx) {
    const userId = await getUserId(ctx);
    console.log('User', userId);
  }
};
```

## Login and session handling

[JWT tokens](https://jwt.io/) are used to handle sessions. In the frontend you can perform a login like this:

```graphql
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      # optional
      name
    }
  }
}
```

And then save the token to `localStorage`. Now you need to send the token with every request. If you are using Apollo, [the documentation](https://www.apollographql.com/docs/react/recipes/authentication.html#Header) has a great example on how to do this.

## Adding custom fields to the User type

If you wish to expose some fields on the User type that are not exposed in our [schema.graphql](./schema.graphql), you can provide your own User. In your own `schema.graphql`, do something like the following:

```graphql
# import Mutation.* from "node_modules/graphql-user/schema.graphql"

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
  lastLogin: DateTime
  joinedAt: DateTime!
  isSuper: Boolean!
  # And finally, our custom field:
  isWillingToDance: Boolean!
}
```

If for example you do not want the `joinedAt` field to be exposed, you can simply remove it from your schema.

> `extend type User` would save some copy/pasta here, but unfortunately that doesn't work yet in `graphql-js`. [More info](https://github.com/graphcool/graphql-import/issues/42#issuecomment-357693183).

## Signup only by invite

By default everyone can signup for your project. But what if you want to only allow invite by signup? In this case you need to leave out the `Mutation.signup` import. Example:

```graphql
# import Mutation.signupByInvite, Mutation.inviteUser, Mutation.login, Mutation.changePassword, Mutation.updateCurrentUser, Mutation.triggerPasswordReset, Mutation.passwordReset, from "node_modules/graphql-user/schema.graphql"
```

## Making email confirmation required before login

After a user signups via the `signup` endpoint, they will get an email with a link in it to confirm their email. Meanwhile they can still login in the app. This is done to not disturb the users flow too much (e.g. services like Twitter do this too). It is left open to the project to block the user after a while. With the fields `emailConfirmed` and `joinedAt` on the User you can perhaps display a warning in your frontend or disallow certain features.

However, you might want to block the user from logging in at all when their email is not yet confirmed. In this case you need to pass this option:

```js
graphqlUser: graphqlUserConfig({
  requiredConfirmedEmailForLogin: true
});
```
