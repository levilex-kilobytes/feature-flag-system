import { findFlag } from "./flagService";

export async function evaluateFlag(key: string, user: string) {
  const flag = await findFlag(key);

  if (!flag) {
    return {
      flag: key,
      enabled: false,
      reason: "FLAG_NOT_FOUND",
    };
  }

  if (!flag.enabled) {
    return {
      flag: key,
      enabled: false,
      reason: "FLAG_DISABLED",
    };
  }

  return {
    flag: key,
    enabled: true,
    reason: "FLAG_ENABLED",
  };
}
