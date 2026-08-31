import { desc, eq } from "drizzle-orm";
import { db } from "../database/connection";
import { flagHistory } from "../database/schema";

export async function createFlagHistory(data: {
  flagId: string;
  environment?: string;
  actorId: string;
  changeType: string;
  beforeValue?: unknown;
  afterValue?: unknown;
}) {
  return db
    .insert(flagHistory)
    .values({
      flagId: data.flagId,
      environment: data.environment,
      actorId: data.actorId,
      changeType: data.changeType,
      beforeValue: data.beforeValue,
      afterValue: data.afterValue,
    })
    .returning();
}

export async function getFlagHistory(flagId: string) {
  return db
    .select()
    .from(flagHistory)
    .where(eq(flagHistory.flagId, flagId))
    .orderBy(desc(flagHistory.createdAt));
}
