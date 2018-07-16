# GraphQL Authentication Prisma

A Prisma adapter for [Graphql Authentication](https://github.com/Volst/graphql-authentication/blob/master/README.md).

# Install

Node v8+ should be used. Install with Yarn or npm:

```
yarn add graphql-authentication graphql-authentication-prisma email-templates
npm i graphql-authentication graphql-authentication-prisma email-templates
```

# Usage with Prisma

You can read the guide below or checkout [the example](https://github.com/Volst/graphql-authentication/tree/master/examples/with-prisma) to see the full code.

## Step 1

Read the [Usage](https://github.com/Volst/graphql-authentication/blob/master/README.md#usage) section in the full documentation first.

## Step 2

After configuring the basics, you can now add this package as an adapter. Pseudo-code example:

```js
import { GraphqlAuthenticationPrismaAdapter } from 'graphql-authentication-prisma';

graphqlAuthentication: graphqlAuthenticationConfig({
  adapter: new GraphqlAuthenticationPrismaAdapter({
    // Optional, defaults to 'db'
    prismaContextName: 'db'
  })
});
```

## Step 3

In your Prisma `datamodel.graphql` file, add this [User model](https://github.com/Volst/graphql-authentication/blob/master/examples/with-prisma/datamodel.graphql). Run `prisma deploy` to run the migrations.

### [Full Documentation](https://github.com/Volst/graphql-authentication/blob/master/README.md#documentation)
