# Sequelize example

This is an example of how to use GraphQL Authentication with [Sequelize](http://docs.sequelizejs.com/). There is no adapter package for Sequelize yet, so in this example we write our own adapter (see `SequelizeAdapter.js`).

Sequelize is configured with SQLite, but only because it doesn't require you to manually start a database so this example stays simple. It also works with MySQL, Postgres etc.

## Usage

```
npm i
npm start
```

Go to http://localhost:4000 in your browser and start executing some queries and mutations!
