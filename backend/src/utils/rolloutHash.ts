import { createHash } from "crypto";

export function getRolloutBucket(userId: string, flagKey: string): number {
  const input = `${userId}:${flagKey}`;

  const hash = createHash("sha256").update(input).digest("hex");

  const firstEightCharacters = hash.slice(0, 8);

  const number = parseInt(firstEightCharacters, 16);

  return number % 100;
}
