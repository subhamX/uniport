import { MongoClient } from 'mongodb'
import { exit } from 'process';
import { DB_NAME, MONGO_URL } from '../config/constants';


if (MONGO_URL === undefined) {
	console.error("MONGO_URL isn't defined!");
	exit(1);
}

const client = (new MongoClient(MONGO_URL))
client.connect().then(e => {
	console.log("Connected")
}).catch(e => {
	console.log("Something went wrong while connecting to MongoDb database");
});

export const dbClient = client.db(DB_NAME)


// ensure that the following commands are executed on init
// dbClient.collection('user').createIndex( { email_address: 1 }, { unique: true } )
// dbClient.collection('invited_user').createIndex( { email: 1 }, { unique: true } )
