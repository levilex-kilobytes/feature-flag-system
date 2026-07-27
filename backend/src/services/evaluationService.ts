import { getFlagByKey } from "../repositories/flagRepository";
import { isTargeted } from "../repositories/targetRepository";

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

  return {
    flag: flagKey,
    enabled: true,
    reason: "FLAG_ENABLED",
  };
}
