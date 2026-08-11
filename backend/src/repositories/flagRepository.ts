import { db } from "../database/connection";
import { flags } from "../database/schema";
import { eq } from "drizzle-orm";

export async function createFlag(data: any) {
  return db.insert(flags).values(data).returning();
}

export async function getFlags() {
  return db.select().from(flags);
}

export async function getFlagByKey(key: string) {
  const [flag] = await db.select().from(flags).where(eq(flags.key, key));

  return flag;
}

export async function updateFlag(key: string, enabled: boolean) {
  return db
    .update(flags)
    .set({
      enabled,
    })
    .where(eq(flags.key, key))
    .returning();
}
export async function updateRolloutPercentage(
  key: string,
  rolloutPercentage: number,
) {
  const [flag] = await db
    .update(flags)
    .set({
      rolloutPercentage,
    })
    .where(eq(flags.key, key))
    .returning();

  return flag;
}
