import { describe, expect, it } from "vitest";
import {
  recordFlagHistory,
  getHistoryForFlag,
} from "../services/flagHistoryService";

describe("Flag history", () => {
  const flagKey = "checkout";

  it("records a history entry", async () => {
    const result = await recordFlagHistory({
      key: flagKey,
      environment: "staging",
      actorId: "monda",
      changeType: "TEST_CHANGE",
      beforeValue: {
        enabled: false,
      },
      afterValue: {
        enabled: true,
      },
    });

    expect(result).toBeDefined();
    expect(result.actorId).toBe("monda");
    expect(result.changeType).toBe("TEST_CHANGE");
  });

  it("stores the environment", async () => {
    const result = await recordFlagHistory({
      key: flagKey,
      environment: "production",
      actorId: "monda",
      changeType: "ROLLOUT_CHANGED",
      beforeValue: {
        rolloutPercentage: 20,
      },
      afterValue: {
        rolloutPercentage: 50,
      },
    });

    expect(result.environment).toBe("production");
  });

  it("stores before and after values", async () => {
    const result = await recordFlagHistory({
      key: flagKey,
      environment: "staging",
      actorId: "monda",
      changeType: "FLAG_TOGGLED",
      beforeValue: {
        enabled: false,
      },
      afterValue: {
        enabled: true,
      },
    });

    expect(result.beforeValue).toEqual({
      enabled: false,
    });

    expect(result.afterValue).toEqual({
      enabled: true,
    });
  });

  it("returns history entries for a flag", async () => {
    await recordFlagHistory({
      key: flagKey,
      environment: "staging",
      actorId: "monda",
      changeType: "TEST_HISTORY",
      beforeValue: null,
      afterValue: {
        test: true,
      },
    });

    const history = await getHistoryForFlag(flagKey);

    expect(history.length).toBeGreaterThan(0);
  });

  it("records the actor responsible for the change", async () => {
    const result = await recordFlagHistory({
      key: flagKey,
      environment: "staging",
      actorId: "test-user",
      changeType: "ACTOR_TEST",
    });

    expect(result.actorId).toBe("test-user");
  });

  it("history entries have a creation timestamp", async () => {
    const result = await recordFlagHistory({
      key: flagKey,
      environment: "staging",
      actorId: "monda",
      changeType: "TIMESTAMP_TEST",
    });

    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
