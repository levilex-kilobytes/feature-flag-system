import dotenv from "dotenv";

dotenv.config();

const environmentValue =
  process.env.FEATURE_FLAG_ENVIRONMENTS || "staging,production";

export const environments = environmentValue
  .split(",")
  .map((environment) => environment.trim())
  .filter(Boolean);

export function isValidEnvironment(environment: string): boolean {
  return environments.includes(environment);
}
