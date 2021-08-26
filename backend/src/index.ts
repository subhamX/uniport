import { fastify } from 'fastify';
import { Client } from "cassandra-driver";
import path from 'path';
import { CASSANDRA_PASSWORD, CASSANDRA_USERNAME } from './config/constants';


const client = new Client({
    cloud: {
        secureConnectBundle: path.join(__dirname, "..", "secure-connect-creds.zip"),
    },
    credentials: {
        username: CASSANDRA_USERNAME,
        password: CASSANDRA_PASSWORD,
    },
});


const app = fastify()


app.get('/', async (request, reply) => {
    await client.connect();
    const rs = await client.execute("SELECT * FROM system.local");
    return { hello: rs }
})

const start = async () => {
    try {
        await app.listen(4200)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()

