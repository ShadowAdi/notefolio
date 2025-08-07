import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const User = pgTable("User", {
  id: uuid("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").unique().notNull(),
  profileUrl: text("profileUrl").default(""),
  password: varchar("password").notNull(),
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
