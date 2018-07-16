# TypeORM example

This is an example of how to use GraphQL Authentication with [TypeORM](http://typeorm.io/). There is no adapter package for TypeORM yet, so in this example we write our own adapter (see `TypeOrmAdapter.js`).

TypeORM is configured with SQLite, but only because it doesn't require you to manually start a database so this example stays simple. It also works with MySQL, Postgres etc.

## Usage

```
npm i
npm start
```

Go to http://localhost:4000 in your browser and start running some queries and mutations!
