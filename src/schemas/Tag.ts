import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { Blog } from "./Blog";

export const tagTable = pgTable("blogTags", {
  blogId: uuid("blogId")
    .notNull()
    .references(() => Blog.id),
  tag: text("tag").notNull(),
});
