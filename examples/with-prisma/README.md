# Prisma example

This is an example of how to use GraphQL Authentication with [Prisma](https://www.prisma.io/). It uses the adapter package for Prisma, [graphql-authentication-prisma](https://github.com/Volst/graphql-authentication/tree/master/packages/graphql-authentication-prisma).

## Usage

You need to have Docker installed. If you're new to Prisma, you might want to read the [Quickstart](https://www.prismagraphql.com/docs/quickstart/) first.

```
docker-compose up -d # now wait for it to start
yarn prisma deploy
npm i
npm start
```

Go to http://localhost:4000 in your browser and start running some queries and mutations!
