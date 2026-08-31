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

import { recordFlagHistory } from "./flagHistoryService";

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

  // Create configuration for every environment
  for (const environment of environments) {
    await createFlagEnvironment({
      flagId: flag.id,
      environment,
      enabled: false,
      rolloutPercentage: 0,
    });
  }

  // Record flag creation in history
  await recordFlagHistory({
    key: data.key,
    actorId: data.actorId ?? "system",
    changeType: "FLAG_CREATED",
    beforeValue: null,
    afterValue: {
      key: data.key,
      description: data.description,
      environments,
    },
  });

  return {
    message: "Flag created successfully.",
    flag,
    environments,
  };
}

export async function getAllFlags() {
  const flags = await getFlags();

  const flagsWithEnvironments = await Promise.all(
    flags.map(async (flag) => {
      const flagEnvironments = await Promise.all(
        environments.map(async (environment) => {
          const config = await getFlagEnvironment(flag.id, environment);

          return config;
        }),
      );

      return {
        ...flag,
        environments: flagEnvironments.filter((config) => config !== undefined),
      };
    }),
  );

  return flagsWithEnvironments;
}

export async function getSingleFlag(key: string) {
  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  const flagEnvironments = await Promise.all(
    environments.map(async (environment) => {
      const config = await getFlagEnvironment(flag.id, environment);

      return config;
    }),
  );

  return {
    ...flag,
    environments: flagEnvironments.filter((config) => config !== undefined),
  };
}

export async function toggleFlag(
  key: string,
  environment: string,
  enabled: boolean,
  actorId: string,
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

  const previousEnabled = flagEnvironment.enabled;

  const result = await updateFlagEnvironment(flag.id, environment, enabled);

  await recordFlagHistory({
    key,
    environment,
    actorId: actorId ?? "system",
    changeType: "FLAG_TOGGLED",
    beforeValue: {
      enabled: previousEnabled,
    },
    afterValue: {
      enabled,
    },
  });

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
  actorId: string,
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

  const previousRolloutPercentage = flagEnvironment.rolloutPercentage;

  const updatedFlag = await updateRolloutPercentage(
    flag.id,
    environment,
    percentage,
  );

  await recordFlagHistory({
    key,
    environment,
    actorId: actorId ?? "system",
    changeType: "ROLLOUT_PERCENTAGE_CHANGED",
    beforeValue: {
      rolloutPercentage: previousRolloutPercentage,
    },
    afterValue: {
      rolloutPercentage: percentage,
    },
  });

  return {
    message: "Rollout percentage updated successfully.",
    environment,
    flag: updatedFlag,
  };
}
