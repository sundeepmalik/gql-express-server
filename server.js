import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import gql from 'graphql-tag';

import Logger from './utils/logger';

// Schema imports
import schema from './src';

const port = 4000;

const gqlLogger = new Logger();
global.logger = gqlLogger;

const app = express();

const startServer = () => {
    app.use(cors());
    app.use('/manage/health', (req, res) => {
        res.send('Healthy').end();
    });
    const server = new ApolloServer({
        cors: true,
        schema,
        tracing: true,
        introspection: true,
        playground: false
    });

    const playground = new ApolloServer({
        cors: true,
        schema,
        tracing: true,
        introspection: true,
        playground: {
            endpoint: '/api/gql'
        }
    });
    app.use('/api/gql', (req, res, next) => {
        const startHrTime = process.hrtime();
        res.on('finish', () => {
            if (req.body && req.body.query) {
                const query = gql`${ req.body.query }`;
                const queryName = query.definitions[0].selectionSet.selections[0].name.value;
                const elapsedHrTime = process.hrtime(startHrTime);
                const elapsedHrTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
                console.log('queryName = ' + queryName);
                console.log('elapsedHrTime = ' + elapsedHrTime);
                console.log('elapsedHrTimeInMs = ' + elapsedHrTimeInMs);
            }
        });

        next();
    });

    server.applyMiddleware({
        app,
        path: '/api/gql',
    });
    playground.applyMiddleware({
        app,
        path: '/gql/playground',
    });

    app.listen({ port }, () => {
    gqlLogger.info(`Server ready at http://localhost:${ port }${ server.graphqlPath }`);
    });
};

export default startServer;
