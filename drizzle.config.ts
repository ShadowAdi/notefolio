import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

export default defineConfig({
  schema: "./src/schemas/*",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});

