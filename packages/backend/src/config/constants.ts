import dotenv from 'dotenv';

dotenv.config();

export const CASSANDRA_USERNAME=process.env.CASSANDRA_USERNAME as string;
export const CASSANDRA_PASSWORD=process.env.CASSANDRA_PASSWORD as string;
export const CASSANDRA_KEYSPACE=process.env.CASSANDRA_KEYSPACE as string;

