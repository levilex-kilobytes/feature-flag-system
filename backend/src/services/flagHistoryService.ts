import {
  createFlagHistory,
  getFlagHistory,
} from "../repositories/flagHistoryRepository";
import { getFlagByKey } from "../repositories/flagRepository";

export async function recordFlagHistory(data: {
  key: string;
  environment?: string;
  actorId: string;
  changeType: string;
  beforeValue?: unknown;
  afterValue?: unknown;
}) {
  const flag = await getFlagByKey(data.key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  const [history] = await createFlagHistory({
    flagId: flag.id,
    environment: data.environment,
    actorId: data.actorId,
    changeType: data.changeType,
    beforeValue: data.beforeValue,
    afterValue: data.afterValue,
  });

  return history;
}

export async function getHistoryForFlag(key: string) {
  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  return getFlagHistory(flag.id);
}
