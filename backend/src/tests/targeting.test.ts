import { describe, expect, it } from "vitest";
import {
  addUserTarget,
  getUserTargets,
  removeUserTarget,
} from "../services/targetService";

describe("Targeting", () => {
  const flagKey = "checkout";
  const environment = "staging";

  it("adds a user to the targeting list", async () => {
    const userId = `target-${Date.now()}-1`;

    const result = await addUserTarget(flagKey, environment, userId, "monda");

    expect(result.userId).toBe(userId);
  });

  it("lists targeted users", async () => {
    const userId = `target-${Date.now()}-2`;

    await addUserTarget(flagKey, environment, userId, "monda");

    const targets = await getUserTargets(flagKey, environment);

    expect(targets.some((target) => target.userId === userId)).toBe(true);
  });

  it("does not allow the same user to be targeted twice", async () => {
    const userId = `target-${Date.now()}-3`;

    await addUserTarget(flagKey, environment, userId, "monda");

    await expect(
      addUserTarget(flagKey, environment, userId, "monda"),
    ).rejects.toThrow("User is already targeted");
  });

  it("removes a targeted user", async () => {
    const userId = `target-${Date.now()}-4`;

    await addUserTarget(flagKey, environment, userId, "monda");

    const result = await removeUserTarget(
      flagKey,
      environment,
      userId,
      "monda",
    );

    expect(result.message).toBe("Target removed successfully");
  });

  it("does not allow removing a user that is not targeted", async () => {
    const userId = `not-targeted-${Date.now()}`;

    await expect(
      removeUserTarget(flagKey, environment, userId, "monda"),
    ).rejects.toThrow("User is not targeted");
  });

  it("rejects an invalid environment", async () => {
    await expect(getUserTargets(flagKey, "development")).rejects.toThrow(
      "Invalid environment",
    );
  });

  it("allows a user to be added again after removal", async () => {
    const userId = `target-${Date.now()}-5`;

    await addUserTarget(flagKey, environment, userId, "monda");

    await removeUserTarget(flagKey, environment, userId, "monda");

    const result = await addUserTarget(flagKey, environment, userId, "monda");

    expect(result.userId).toBe(userId);
  });
});
