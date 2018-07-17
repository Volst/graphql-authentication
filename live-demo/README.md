# Live Demo

The code in this repository is used to host a live demo on x.now.sh (TODO).

The live demo uses an in-memory adapter, so everytime the server restarts the data is gone. For a demo this is perfect :).

## Test locally

Run `yarn && yarn start`.

## Deploy on Now

Copy `.env.example` to `.env` and fill the variables in.

```
npm i -g now
now --dotenv
now alias graphql-authentication-demo.now.sh
```
