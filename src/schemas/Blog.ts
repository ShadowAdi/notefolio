import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { User } from "./User";

export const Blog = pgTable("blog", {
  id: uuid("id").primaryKey(),
  blogTitle: text("blogTitle").unique().notNull(),
  blogDescription: text("blogDescription").notNull(),
  blogTags: text("blogTags").array().notNull(),
  blogCover: text("blogCover").notNull(),
  authorId: uuid("authorId").references(() => User.id),
  upvotes: uuid("upvotes")
    .array()
    .default([])
    .references(() => User.id),
  downvotes: uuid("downvotes")
    .array()
    .default([])
    .references(() => User.id),
});
