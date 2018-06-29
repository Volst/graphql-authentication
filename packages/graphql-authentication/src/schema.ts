import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';

// This is only used for generating `src/binding.ts`
export default makeExecutableSchema({
  typeDefs: importSchema(path.resolve('schema.graphql'))
});
