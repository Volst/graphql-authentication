Pull requests and issues are very welcome!

# Prerequisites

- Node v8+

# Getting started

To get started, clone this repository and run `yarn` in the repository root. Note you have to use Yarn, npm will not work correctly.

In the `packages/` folder, pick one of the packages you want to work on. You can run the tests inside a package with `yarn test`.
If you want to use a GraphQL Playground to test something by hand, you can go to `packages/graphql-authentication-prisma/example` and run `docker-compose up -d` in it (this requires you have Docker installed). Then, run `yarn start`.

# Adding a feature or changing behavior

For features or changes, please create a new issue first. Since this is a very opinionated package, it is possible I don’t like the change. By discussing it first you can prevent wasted time. But please do! I am very open to improvements.
