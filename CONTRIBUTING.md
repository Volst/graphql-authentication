Pull requests and issues are very welcome!

# Prerequisites

* Node v8+
* Docker and Docker Compose
* Prisma CLI (`npm i -g prisma`) - v1.7+

# Getting started

To get started, clone this repository and run `yarn` or `npm i`.

After that you can use the example to test your stuff. First you'll have to start Prisma locally with `cd example && docker-compose up -d`. When it is done, you can deploy a service with `prisma deploy` in the `example/` folder.

Now to start the example server you can run `yarn start`.

# Adding a feature or changing behavior

For features or changes, please create a new issue first. Since this is a very opinionated package, it is possible I don’t like the change. By discussing it first you can prevent wasted time. But please do! I am very open to improvements.
