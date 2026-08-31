import { describe, expect, it } from "vitest";
import { toggleFlag, updateFlagRollout } from "../services/flagService";
import {
  getFlagByKey,
  getFlagEnvironment,
} from "../repositories/flagRepository";

describe("Environment scoping", () => {
  const flagKey = "checkout";

  it("can update staging without changing production", async () => {
    const flag = await getFlagByKey(flagKey);

    expect(flag).toBeDefined();

    if (!flag) return;

    const productionBefore = await getFlagEnvironment(flag.id, "production");

    await toggleFlag(flagKey, "staging", true, "monda");

    const productionAfter = await getFlagEnvironment(flag.id, "production");

    expect(productionAfter?.enabled).toBe(productionBefore?.enabled);
  });

  it("can update production without changing staging", async () => {
    const flag = await getFlagByKey(flagKey);

    expect(flag).toBeDefined();

    if (!flag) return;

    const stagingBefore = await getFlagEnvironment(flag.id, "staging");

    await updateFlagRollout(flagKey, "production", 75, "monda");

    const stagingAfter = await getFlagEnvironment(flag.id, "staging");

    expect(stagingAfter?.rolloutPercentage).toBe(
      stagingBefore?.rolloutPercentage,
    );
  });

  it("rejects an unknown environment", async () => {
    await expect(
      toggleFlag(flagKey, "development", true, "monda"),
    ).rejects.toThrow("Invalid environment");
  });

  it("rejects rollout updates for an unknown environment", async () => {
    await expect(
      updateFlagRollout(flagKey, "development", 50, "monda"),
    ).rejects.toThrow("Invalid environment");
  });
});
