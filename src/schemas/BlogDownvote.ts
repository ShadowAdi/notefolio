import { pgTable,uuid } from "drizzle-orm/pg-core";
import { Blog } from "./Blog";
import { User } from "./User";

export const BlogDownvote = pgTable(
  "blogDownvote",
  {
    blogId: uuid("blog_id")
      .notNull()
      .references(() => Blog.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => User.id),
  }
);
