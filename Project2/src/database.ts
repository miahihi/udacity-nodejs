import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    PS_HOST,
    PS_DB,
    PS_USER,
    PS_PASSWORD
} = process.env

const client = new Pool({
    host: PS_HOST,
    database: PS_DB,
    user: PS_USER,
    password: PS_PASSWORD
})
export const query = (text: string, params?: any[]) => client.query(text, params);
export const closeConnection = () => client.end();
export default client;