import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { User } from "./User";
import { BlogSchema } from "./Blog";

export const SavedBlog = pgTable("saved", {
  userId: uuid("userId")
    .notNull()
    .references(() => User.id),
  blogId: uuid("blogId")
    .notNull()
    .references(() => BlogSchema.id),
  id: uuid("id").defaultRandom().primaryKey(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});
