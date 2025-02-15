import { Client } from '@neondatabase/serverless';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
await client.connect();

export default client;
