import { describe, expect, it } from "vitest";
import {
  createNewFlag,
  getSingleFlag,
} from "../services/flagService";

describe("Feature flags", () => {
  it("creates a new flag", async () => {
    const key = `test-flag-${Date.now()}`;

    const result = await createNewFlag({
      key,
      description: "Test feature flag",
      actorId: "monda",
    });

    expect(result.message).toBe(
      "Flag created successfully.",
    );

    expect(result.flag.key).toBe(key);
    expect(result.environments).toContain(
      "staging",
    );
    expect(result.environments).toContain(
      "production",
    );
  });

  it("retrieves a flag by key", async () => {
    const key = `get-flag-${Date.now()}`;

    await createNewFlag({
      key,
      description: "Get test flag",
      actorId: "monda",
    });

    const flag = await getSingleFlag(key);

    expect(flag.key).toBe(key);
    expect(flag.description).toBe(
      "Get test flag",
    );
  });

  it("rejects duplicate flag keys", async () => {
    const key = `duplicate-${Date.now()}`;

    await createNewFlag({
      key,
      description: "First flag",
      actorId: "monda",
    });

    await expect(
      createNewFlag({
        key,
        description: "Second flag",
        actorId: "monda",
      }),
    ).rejects.toThrow(
      "Flag key already exists.",
    );
  });

  it("rejects unknown flags", async () => {
    await expect(
      getSingleFlag(
        `unknown-${Date.now()}`,
      ),
    ).rejects.toThrow("Flag not found.");
  });

  it("creates environments for a new flag", async () => {
    const key = `environment-${Date.now()}`;

    const result = await createNewFlag({
      key,
      description: "Environment test",
      actorId: "monda",
    });

    expect(result.environments).toEqual(
      expect.arrayContaining([
        "staging",
        "production",
      ]),
    );
  });
});