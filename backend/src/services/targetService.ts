import {
  addTarget,
  removeTarget,
  getTargets,
  isTargeted,
} from "../repositories/targetRepository";
import {
  getFlagByKey,
  getFlagEnvironment,
} from "../repositories/flagRepository";
import { environments } from "../config/env";
import { recordFlagHistory } from "./flagHistoryService";

export async function addUserTarget(
  flagKey: string,
  environment: string,
  userId: string,
  actorId: string,
) {
  if (!environments.includes(environment)) {
    throw new Error(
      `Invalid environment. Supported environments: ${environments.join(", ")}`,
    );
  }

  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    throw new Error("Flag not found");
  }

  const flagEnvironment = await getFlagEnvironment(flag.id, environment);

  if (!flagEnvironment) {
    throw new Error("Flag environment configuration not found");
  }

  const exists = await isTargeted(flagEnvironment.id, userId);

  if (exists) {
    throw new Error("User is already targeted");
  }

  const result = await addTarget(flagEnvironment.id, userId);

  await recordFlagHistory({
    key: flagKey,
    environment,
    actorId,
    changeType: "TARGET_ADDED",
    beforeValue: null,
    afterValue: {
      userId,
    },
  });

  return result[0];
}

export async function removeUserTarget(
  flagKey: string,
  environment: string,
  userId: string,
  actorId: string,
) {
  if (!environments.includes(environment)) {
    throw new Error(
      `Invalid environment. Supported environments: ${environments.join(", ")}`,
    );
  }

  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    throw new Error("Flag not found");
  }

  const flagEnvironment = await getFlagEnvironment(flag.id, environment);

  if (!flagEnvironment) {
    throw new Error("Flag environment configuration not found");
  }

  const exists = await isTargeted(flagEnvironment.id, userId);

  if (!exists) {
    throw new Error("User is not targeted");
  }

  const result = await removeTarget(flagEnvironment.id, userId);

  await recordFlagHistory({
    key: flagKey,
    environment,
    actorId,
    changeType: "TARGET_REMOVED",
    beforeValue: {
      userId,
    },
    afterValue: null,
  });

  return {
    message: "Target removed successfully",
    target: result[0],
  };
}

export async function getUserTargets(flagKey: string, environment: string) {
  if (!environments.includes(environment)) {
    throw new Error(
      `Invalid environment. Supported environments: ${environments.join(", ")}`,
    );
  }

  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    throw new Error("Flag not found");
  }

  const flagEnvironment = await getFlagEnvironment(flag.id, environment);

  if (!flagEnvironment) {
    throw new Error("Flag environment configuration not found");
  }

  return getTargets(flagEnvironment.id);
}
