import { eq, and } from "drizzle-orm";
import { db } from "../database/connection";
import { flagTargets } from "../database/schema";

export async function addTarget(flagId: string, userId: string) {
  const [target] = await db
    .insert(flagTargets)
    .values({
      flagId,
      userId,
    })
    .returning();

  return target;
}

export async function removeTarget(flagId: string, userId: string) {
  await db
    .delete(flagTargets)
    .where(and(eq(flagTargets.flagId, flagId), eq(flagTargets.userId, userId)));
}

export async function getTargets(flagId: string) {
  return db.select().from(flagTargets).where(eq(flagTargets.flagId, flagId));
}

export async function isTargeted(flagId: string, userId: string) {
  const [target] = await db
    .select()
    .from(flagTargets)
    .where(and(eq(flagTargets.flagId, flagId), eq(flagTargets.userId, userId)));

  return Boolean(target);
}
