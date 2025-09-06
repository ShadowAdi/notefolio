import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { User } from "./User";
import { sql } from "drizzle-orm";

const blogStatusEnum = pgEnum("blog_status", ["published", "draft"]);

export const BlogSchema = pgTable("blog", {
  id: uuid("id").primaryKey(),
  blogTitle: text("blogTitle").unique().notNull(),
  blogDescription: text("blogDescription").notNull(),
  blogCover: text("blogCover").notNull(),
  authorId: uuid("authorId")
    .notNull()
    .references(() => User.id),
  status: blogStatusEnum("status").default("draft"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
