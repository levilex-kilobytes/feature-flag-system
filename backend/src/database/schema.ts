import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const flags = pgTable("flags", {
  id: uuid("id").defaultRandom().primaryKey(),

  key: varchar("key", {
    length: 100,
  })
    .notNull()
    .unique(),

  description: text("description").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const flagEnvironments = pgTable("flag_environments", {
  id: uuid("id").defaultRandom().primaryKey(),

  flagId: uuid("flag_id")
    .notNull()
    .references(() => flags.id),

  environment: varchar("environment", {
    length: 100,
  }).notNull(),

  enabled: boolean("enabled").notNull().default(false),

  rolloutPercentage: integer("rollout_percentage").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const flagTargets = pgTable("flag_targets", {
  id: uuid("id").defaultRandom().primaryKey(),

  flagEnvironmentId: uuid("flag_environment_id")
    .notNull()
    .references(() => flagEnvironments.id),

  userId: varchar("user_id", {
    length: 255,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const flagHistory = pgTable("flag_history", {
  id: uuid("id").defaultRandom().primaryKey(),

  flagId: uuid("flag_id")
    .notNull()
    .references(() => flags.id),

  environment: varchar("environment", {
    length: 100,
  }),

  actorId: varchar("actor_id", {
    length: 255,
  }).notNull(),

  changeType: varchar("change_type", {
    length: 100,
  }).notNull(),

  beforeValue: jsonb("before_value"),

  afterValue: jsonb("after_value"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
