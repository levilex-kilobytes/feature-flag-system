import { eq, and } from "drizzle-orm";
import { db } from "../database/connection";
import { flagTargets, flagEnvironments } from "../database/schema";

export async function addTarget(flagEnvironmentId: string, userId: string) {
  return db
    .insert(flagTargets)
    .values({
      flagEnvironmentId,
      userId,
    })
    .returning();
}

export async function removeTarget(flagEnvironmentId: string, userId: string) {
  return db
    .delete(flagTargets)
    .where(
      and(
        eq(flagTargets.flagEnvironmentId, flagEnvironmentId),
        eq(flagTargets.userId, userId),
      ),
    )
    .returning();
}

export async function getTargets(flagEnvironmentId: string) {
  return db
    .select()
    .from(flagTargets)
    .where(eq(flagTargets.flagEnvironmentId, flagEnvironmentId));
}

export async function isTargeted(flagEnvironmentId: string, userId: string) {
  const result = await db
    .select()
    .from(flagTargets)
    .where(
      and(
        eq(flagTargets.flagEnvironmentId, flagEnvironmentId),
        eq(flagTargets.userId, userId),
      ),
    );

  return result.length > 0;
}
