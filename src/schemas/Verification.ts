import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { User } from "./User";


export const Verification = pgTable("Verification", {
  id: uuid("id").defaultRandom().primaryKey(),
  otp: varchar("otp").notNull().unique(),
  userId:uuid("userId").notNull().references(()=>User.id),
  expiresIn:timestamp("expiresIn").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
