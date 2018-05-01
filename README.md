# @volst/prisma-auth

An authorization package for [Prisma](https://www.prisma.io/). It uses old-school email/password authentication. The intention is to let you write as less authentication-related code as possible and let you go on with your application, while being flexible enough to support different use cases (open sign up, invitation-only signup, extra fields on the User model).

**Work in progress, this does not work yet!!!**

**Features:**

* Signup with email/password
* Login
* Invite another user
* Password reset
* Change password of current user
* Update current user info
* Put resolvers behind login

## Installation

```
yarn add @volst/prisma-auth
npm i @volst/prisma-auth
```

In your Prisma `datamodel.graphql` file, add this [User model](./example/datamodel.graphql).

In your `schema.graphql` for your own server, add something like the following:

```graphql
# import Query.*, Mutation.* from "node_modules/@volst/prisma-auth/schema.graphql"
```

Then, in your resolvers file:

```js
import { authQueries, authMutations } from '@volst/prisma-auth';
import * as Email from 'email-templates';

const options = {
  // Optional, for sending emails with email-templates (https://www.npmjs.com/package/email-templates)
  mailer: Email(),
  // Optional, the URL to your frontend which is used in emails
  mailAppUrl: 'http://example.com',
};

export default {
  Query: {
    ...authQueries()
  },
  Mutation: {
    ...authMutations(options)
  }
};
```

## Usage

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
