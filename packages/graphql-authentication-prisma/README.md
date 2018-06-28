# GraphQL Authentication Prisma

A Prisma adapter for [Graphql Authentication](https://github.com/Volst/graphql-authentication/blob/master/README.md).

# Install

Node v8+ should be used. Install with Yarn or npm:

```
yarn add graphql-authentication graphql-authentication-prisma email-templates
npm i graphql-authentication graphql-authentication-prisma email-templates
```

# Usage with Prisma

## Step 1

In your Prisma `datamodel.graphql` file, add this [User model](./example/datamodel.graphql).

## Step 2

In your `schema.graphql` for your own server, add something like the following (you can also import specific endpoints only):

```graphql
# import Query.*, Mutation.* from "node_modules/graphql-authentication/schema.graphql"
```

## Step 3

In your server we now need to map these types to resolvers and pass in some options. The following example uses [graphql-yoga](https://github.com/graphcool/graphql-yoga/), but it should also work with Apollo Server.

```js
import { authQueries, authMutations, graphqlAuthenticationConfig } from 'graphql-authentication';
import { GraphqlAuthenticationPrismaAdapter } from 'graphql-authentication-prisma';
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
    graphqlAuthentication: graphqlAuthenticationConfig({
      adapter: new GraphqlAuthenticationPrismaAdapter(),
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

### [Full Documentation](https://github.com/Volst/graphql-authentication/blob/master/README.md#documentation)
