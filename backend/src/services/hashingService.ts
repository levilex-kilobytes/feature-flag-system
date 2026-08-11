import { getBucket } from "../utils/hash";

export function isUserInRollout(
  flagKey: string,
  userId: string,
  rolloutPercentage: number,
): boolean {
  if (rolloutPercentage <= 0) {
    return false;
  }

  if (rolloutPercentage >= 100) {
    return true;
  }

  const bucket = getBucket(flagKey, userId);

  return bucket < rolloutPercentage;
}
