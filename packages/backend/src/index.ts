import { fastify } from 'fastify';
import { Client } from "cassandra-driver";
import path from 'path';
import { CASSANDRA_KEYSPACE, CASSANDRA_PASSWORD, CASSANDRA_USERNAME } from './config/constants';
import { resolvers, schema } from './schema/todo';
import { ApolloServer } from 'apollo-server-fastify';

const server = new ApolloServer({
    typeDefs: schema,
    resolvers
})


const client = new Client({
    cloud: {
        secureConnectBundle: path.join(__dirname, "..", "secure-connect-creds.zip"),
    },
    credentials: {
        username: CASSANDRA_USERNAME,
        password: CASSANDRA_PASSWORD,
    },
    keyspace: CASSANDRA_KEYSPACE
});


const app = fastify()


app.get('/', async (request, reply) => {
    await client.connect();
    const rs = await client.execute(`CREATE TABLE user1(
        user_id UUID,
        PRIMARY KEY(user_id)
    )`);
    return { hello: rs }
});


(async () => {
    try {
        await server.start(); // apollo server
        app.register(server.createHandler());
        let res = await app.listen(4201) // fastify
        console.log(`Server running at ${res}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})();

