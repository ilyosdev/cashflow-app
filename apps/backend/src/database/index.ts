import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { eq, and, like, or, gte, lte, desc, sql } from 'drizzle-orm';

let db: ReturnType<typeof drizzle>;

export function getDatabase() {
  if (!db) {
    const connection = mysql.createPool(process.env.DATABASE_URL!);
    db = drizzle(connection, { schema, mode: 'default' });
  }
  return db;
}

export * from './schema';
export { eq, and, like, or, gte, lte, desc, sql };
