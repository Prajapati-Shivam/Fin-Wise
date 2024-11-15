import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
if (!process.env.DATABASE_URL) throw new Error('No DATABASE_URL found!');

export default defineConfig({
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
