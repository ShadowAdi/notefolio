import { pgTable, uuid } from "drizzle-orm/pg-core";
import { BlogSchema } from "./Blog";
import { User } from "./User";

export const BlogUpvote = pgTable("blogUpvote", {
  id: uuid("id").defaultRandom().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => BlogSchema.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id),
});
