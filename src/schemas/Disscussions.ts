import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { BlogSchema } from "./Blog";
import { User } from "./User";

export const Discussion = pgTable("discussion", {
  description: text("description").notNull(),
  id: uuid("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  blogId: uuid("blodId")
    .notNull()
    .references(() => BlogSchema.id),
  userId: uuid("authordId")
    .notNull()
    .references(() => User.id),
});
