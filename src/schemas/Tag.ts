import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { BlogSchema } from "./Blog";

export const tagTable = pgTable("blogTags", {
  blogId: uuid("blogId")
    .notNull()
    .references(() => BlogSchema.id),
  tag: text("tag").notNull(),
});
