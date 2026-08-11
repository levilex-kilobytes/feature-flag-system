import crypto from "crypto";

export function getBucket(flagKey: string, userId: string): number {
  const input = `${flagKey}:${userId}`;

  const hash = crypto.createHash("sha256").update(input).digest("hex");

  const value = parseInt(hash.substring(0, 8), 16);

  return value % 100;
}
