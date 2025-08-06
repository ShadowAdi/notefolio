import { pgTable, uuid } from "drizzle-orm/pg-core";
import { Blog } from "./Blog";
import { User } from "./User";

export const BlogUpvote = pgTable(
  "blogUpvote",
  {
    blogId: uuid("blog_id")
      .notNull()
      .references(() => Blog.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => User.id),
  }
);
