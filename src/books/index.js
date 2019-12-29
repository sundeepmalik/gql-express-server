import { importSchema } from 'graphql-import/dist/index';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';

import resolvers from './resolvers';

const typeDefs = importSchema(path.join(__dirname, './types.graphql'));
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
