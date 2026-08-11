import {
  getFlagByKey,
  getFlagEnvironment,
} from "../repositories/flagRepository";
import { isTargeted } from "../repositories/targetRepository";
import { getRolloutBucket } from "../utils/rolloutHash";
import { environments } from "../config/env";

export async function evaluateFlag(
  flagKey: string,
  userId: string,
  environment: string,
) {
  if (!environments.includes(environment)) {
    return {
      flag: flagKey,
      environment,
      enabled: false,
      reason: "INVALID_ENVIRONMENT",
    };
  }

  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    return {
      flag: flagKey,
      environment,
      enabled: false,
      reason: "FLAG_NOT_FOUND",
    };
  }

  const flagEnvironment = await getFlagEnvironment(flag.id, environment);

  if (!flagEnvironment) {
    return {
      flag: flagKey,
      environment,
      enabled: false,
      reason: "FLAG_ENVIRONMENT_NOT_CONFIGURED",
    };
  }

  if (!flagEnvironment.enabled) {
    return {
      flag: flagKey,
      environment,
      enabled: false,
      reason: "FLAG_DISABLED",
    };
  }

  const targeted = await isTargeted(flagEnvironment.id, userId);

  if (targeted) {
    return {
      flag: flagKey,
      environment,
      enabled: true,
      reason: "TARGET_MATCH",
    };
  }

  if (flagEnvironment.rolloutPercentage === 0) {
    return {
      flag: flagKey,
      environment,
      enabled: false,
      reason: "ROLLOUT_EXCLUDED",
    };
  }

  if (flagEnvironment.rolloutPercentage === 100) {
    return {
      flag: flagKey,
      environment,
      enabled: true,
      reason: "ROLLOUT_MATCH",
    };
  }

  const bucket = getRolloutBucket(userId, flagKey);

  if (bucket < flagEnvironment.rolloutPercentage) {
    return {
      flag: flagKey,
      environment,
      enabled: true,
      reason: "ROLLOUT_MATCH",
    };
  }

  return {
    flag: flagKey,
    environment,
    enabled: false,
    reason: "ROLLOUT_EXCLUDED",
  };
}
