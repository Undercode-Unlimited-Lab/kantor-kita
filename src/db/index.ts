import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let sqlClient: NeonQueryFunction<false, false> | null = null;
let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const connectionString = process.env.DATABASE_URL;

  // In production or with valid connection string, connect to Neon Postgres
  if (connectionString && connectionString.startsWith('postgres')) {
    sqlClient = neon(connectionString);
    dbInstance = drizzle(sqlClient, { schema });
    return dbInstance;
  }

  return null;
}

export { schema };
