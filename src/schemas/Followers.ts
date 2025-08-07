import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { User } from "./User";

export const Followers = pgTable(
  "followers",
  {
    followerId: uuid("followerId")
      .notNull()
      .references(() => User.id),
    followingId: uuid("followingId")
      .notNull()
      .references(() => User.id),
  },
  (t) => [primaryKey({ columns: [t.followerId, t.followingId] })]
);
