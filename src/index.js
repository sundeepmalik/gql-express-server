import { mergeSchemas } from 'graphql-tools';

// Import schemas
import booksSchema from './books';
import courseSchema from './courses';

const gqlSchema = mergeSchemas({
    schemas: [
        booksSchema,
        courseSchema
    ],
});

export default gqlSchema;
