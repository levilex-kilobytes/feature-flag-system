import { and, eq } from "drizzle-orm";
import { db } from "../database/connection";
import { flags, flagEnvironments } from "../database/schema";

export async function createFlag(data: { key: string; description: string }) {
  return db.insert(flags).values(data).returning();
}

export async function getFlags() {
  return db.select().from(flags);
}

export async function getFlagByKey(key: string) {
  const result = await db.select().from(flags).where(eq(flags.key, key));

  return result[0];
}

export async function getFlagEnvironment(flagId: string, environment: string) {
  const result = await db
    .select()
    .from(flagEnvironments)
    .where(
      and(
        eq(flagEnvironments.flagId, flagId),
        eq(flagEnvironments.environment, environment),
      ),
    );

  return result[0];
}

export async function createFlagEnvironment(data: {
  flagId: string;
  environment: string;
  enabled?: boolean;
  rolloutPercentage?: number;
}) {
  return db
    .insert(flagEnvironments)
    .values({
      flagId: data.flagId,
      environment: data.environment,
      enabled: data.enabled ?? false,
      rolloutPercentage: data.rolloutPercentage ?? 0,
    })
    .returning();
}

export async function updateFlagEnvironment(
  flagId: string,
  environment: string,
  enabled: boolean,
) {
  return db
    .update(flagEnvironments)
    .set({
      enabled,
    })
    .where(
      and(
        eq(flagEnvironments.flagId, flagId),
        eq(flagEnvironments.environment, environment),
      ),
    )
    .returning();
}

export async function updateRolloutPercentage(
  flagId: string,
  environment: string,
  rolloutPercentage: number,
) {
  const result = await db
    .update(flagEnvironments)
    .set({
      rolloutPercentage,
    })
    .where(
      and(
        eq(flagEnvironments.flagId, flagId),
        eq(flagEnvironments.environment, environment),
      ),
    )
    .returning();

  return result[0];
}
