import {
  addTarget,
  removeTarget,
  getTargets,
  isTargeted,
} from "../repositories/targetRepository";
import { getFlagByKey } from "../repositories/flagRepository";

export async function addUserTarget(flagKey: string, userId: string) {
  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    throw new Error("Flag not found");
  }

  const exists = await isTargeted(flag.id, userId);

  if (exists) {
    throw new Error("User is already targeted");
  }

  return addTarget(flag.id, userId);
}

export async function removeUserTarget(flagKey: string, userId: string) {
  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    throw new Error("Flag not found");
  }

  await removeTarget(flag.id, userId);

  return {
    message: "Target removed successfully",
  };
}

export async function getUserTargets(flagKey: string) {
  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    throw new Error("Flag not found");
  }

  return getTargets(flag.id);
}
