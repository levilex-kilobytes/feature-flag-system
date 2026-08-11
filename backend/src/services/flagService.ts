import {
  createFlag,
  getFlags,
  getFlagByKey,
  createFlagEnvironment,
  getFlagEnvironment,
  updateFlagEnvironment,
  updateRolloutPercentage,
} from "../repositories/flagRepository";
import { environments } from "../config/env";

export async function createNewFlag(data: {
  key: string;
  description: string;
  actorId?: string;
}) {
  const existingFlag = await getFlagByKey(data.key);

  if (existingFlag) {
    throw new Error("Flag key already exists.");
  }

  const [flag] = await createFlag({
    key: data.key,
    description: data.description,
  });

  for (const environment of environments) {
    await createFlagEnvironment({
      flagId: flag.id,
      environment,
      enabled: false,
      rolloutPercentage: 0,
    });
  }

  return {
    message: "Flag created successfully.",
    flag,
    environments,
  };
}

export async function getAllFlags() {
  return getFlags();
}

export async function getSingleFlag(key: string) {
  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  return flag;
}

export async function toggleFlag(
  key: string,
  environment: string,
  enabled: boolean,
) {
  if (!environments.includes(environment)) {
    throw new Error(
      `Invalid environment. Supported environments: ${environments.join(", ")}`,
    );
  }

  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  const flagEnvironment = await getFlagEnvironment(flag.id, environment);

  if (!flagEnvironment) {
    throw new Error("Flag environment configuration not found.");
  }

  const result = await updateFlagEnvironment(flag.id, environment, enabled);

  return {
    message: "Flag updated successfully.",
    environment,
    flag: result[0],
  };
}

export async function updateFlagRollout(
  key: string,
  environment: string,
  rolloutPercentage: number,
) {
  if (!environments.includes(environment)) {
    throw new Error(
      `Invalid environment. Supported environments: ${environments.join(", ")}`,
    );
  }

  const percentage = Number(rolloutPercentage);

  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new Error("Rollout percentage must be between 0 and 100.");
  }

  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  const flagEnvironment = await getFlagEnvironment(flag.id, environment);

  if (!flagEnvironment) {
    throw new Error("Flag environment configuration not found.");
  }

  const updatedFlag = await updateRolloutPercentage(
    flag.id,
    environment,
    percentage,
  );

  return {
    message: "Rollout percentage updated successfully.",
    environment,
    flag: updatedFlag,
  };
}
