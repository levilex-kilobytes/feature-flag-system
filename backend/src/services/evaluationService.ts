import { getFlagByKey } from "../repositories/flagRepository";
import { isTargeted } from "../repositories/targetRepository";
import { getRolloutBucket } from "../utils/rolloutHash";

export async function evaluateFlag(flagKey: string, userId: string) {
  const flag = await getFlagByKey(flagKey);

  if (!flag) {
    return {
      flag: flagKey,
      enabled: false,
      reason: "FLAG_NOT_FOUND",
    };
  }

  if (!flag.enabled) {
    return {
      flag: flagKey,
      enabled: false,
      reason: "FLAG_DISABLED",
    };
  }

  const targeted = await isTargeted(flag.id, userId);

  if (targeted) {
    return {
      flag: flagKey,
      enabled: true,
      reason: "TARGET_MATCH",
    };
  }

  if (flag.rolloutPercentage === 0) {
    return {
      flag: flagKey,
      enabled: false,
      reason: "ROLLOUT_EXCLUDED",
    };
  }

  if (flag.rolloutPercentage === 100) {
    return {
      flag: flagKey,
      enabled: true,
      reason: "ROLLOUT_MATCH",
    };
  }

  const bucket = getRolloutBucket(userId, flagKey);

  if (bucket < flag.rolloutPercentage) {
    return {
      flag: flagKey,
      enabled: true,
      reason: "ROLLOUT_MATCH",
    };
  }

  return {
    flag: flagKey,
    enabled: false,
    reason: "ROLLOUT_EXCLUDED",
  };
}
