import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const pgUser = pgTable("User", {
  id: uuid("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").unique().notNull(),
  profileUrl: text("profileUrl").default(""),
  password: varchar("password").notNull(),
  bio: text("bio"),
  followersCount: integer("followersCount").default(0),
  followingsCount: integer("followingsCount").default(0),
  followers: uuid("followers").array().default([]),
  followings: uuid("followings").array().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
