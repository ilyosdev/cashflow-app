import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema',
  out: './src/database/migrations',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/subscriptions',
  },
} satisfies Config;
