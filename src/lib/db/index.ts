import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/db/schema';

// Use the DATABASE_URL specifically from Neon (with the neondb_owner user and pooling)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema, logger: process.env.DB_LOGGING === 'true' });
