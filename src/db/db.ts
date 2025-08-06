import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(`Failed to Connect Database`);
  throw new Error(`Database URL Is Not Provided`);
}

export const db = drizzle(DATABASE_URL);
