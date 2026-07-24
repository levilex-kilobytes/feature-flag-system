import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const flags = pgTable("flags", {
  id: uuid("id").defaultRandom().primaryKey(),

  key: varchar("key", {
    length: 100,
  })
    .notNull()
    .unique(),

  description: text("description").notNull(),

  enabled: boolean("enabled").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow(),
});
