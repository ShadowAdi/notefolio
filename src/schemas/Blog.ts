import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { User } from "./User";
import { sql } from "drizzle-orm";

export const Blog = pgTable("blog", {
  id: uuid("id").primaryKey(),
  blogTitle: text("blogTitle").unique().notNull(),
  blogDescription: text("blogDescription").notNull(),
  blogCover: text("blogCover").notNull(),
  authorId: uuid("authorId")
    .notNull()
    .references(() => User.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});


