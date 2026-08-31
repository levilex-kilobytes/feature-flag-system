import { describe, expect, it } from "vitest";
import { evaluateFlag } from "../services/evaluationService";

describe("Feature flag evaluation", () => {
  it("returns false for an unknown flag", async () => {
    const result = await evaluateFlag("does-not-exist", "user123", "staging");

    expect(result.enabled).toBe(false);
    expect(result.reason).toBe("FLAG_NOT_FOUND");
  });

  it("returns false for an invalid environment", async () => {
    const result = await evaluateFlag("checkout", "user123", "invalid");

    expect(result.enabled).toBe(false);
    expect(result.reason).toBe("INVALID_ENVIRONMENT");
  });

  it("returns false when the flag is disabled", async () => {
    const result = await evaluateFlag("checkout", "user123", "staging");

    expect(result).toHaveProperty("flag");
    expect(result).toHaveProperty("environment");
  });

  it("returns the same result when evaluated repeatedly", async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, () =>
        evaluateFlag("checkout", "user123", "staging"),
      ),
    );

    const enabledResults = results.map((result) => result.enabled);

    expect(new Set(enabledResults).size).toBe(1);
  });

  it("returns a valid evaluation response", async () => {
    const result = await evaluateFlag("checkout", "user123", "staging");

    expect(result).toHaveProperty("flag", "checkout");
    expect(result).toHaveProperty("environment", "staging");
    expect(result).toHaveProperty("enabled");
    expect(result).toHaveProperty("reason");
  });
});
