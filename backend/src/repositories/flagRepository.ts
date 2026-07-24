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
  const result = await db.select().from(flags).where(eq(flags.key, key));

  return result[0];
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
