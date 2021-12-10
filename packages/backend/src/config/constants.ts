import dotenv from 'dotenv';

dotenv.config();

export const PWD_HASH_ROUNDS = parseInt(process.env.PWD_HASH_ROUNDS as string);

export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY as string;
export const BACKEND_SERVER_PORT = process.env.BACKEND_SERVER_PORT as string;

export const MONGO_URL = process.env.MONGO_URL as string;
export const DB_NAME = process.env.DB_NAME;
export const is_production = process.env.NODE_ENV;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;


export const GENERIC_ORG_LOGO_URL = '/generic';


export const genericCompanyLogoUrl = 'https://img.icons8.com/fluency/96/000000/company.png'
