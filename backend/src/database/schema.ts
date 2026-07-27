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

export const flagTargets = pgTable("flag_targets", {
  id: uuid("id").defaultRandom().primaryKey(),

  flagId: uuid("flag_id")
    .notNull()
    .references(() => flags.id),

  userId: varchar("user_id", {
    length: 255,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
