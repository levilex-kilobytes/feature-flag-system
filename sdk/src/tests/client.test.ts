import { describe, expect, it, vi } from "vitest";
import { FeatureFlagClient } from "../client";

describe("FeatureFlagClient", () => {
  it("returns the API evaluation result on the happy path", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        flag: "checkout",
        environment: "staging",
        enabled: true,
        reason: "ROLLOUT_MATCH",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const client = new FeatureFlagClient({
      baseUrl: "http://localhost:4000",
      environment: "staging",
      fallback: false,
    });

    const result = await client.isEnabled("checkout", "user123");

    expect(result).toBe(true);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:4000/evaluate/checkout/staging?userId=user123",
    );

    vi.unstubAllGlobals();
  });

  it("returns the fallback value when the service is unreachable", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValue(new Error("Connection refused"));

    vi.stubGlobal("fetch", mockFetch);

    const client = new FeatureFlagClient({
      baseUrl: "http://localhost:4000",
      environment: "staging",
      fallback: true,
    });

    const result = await client.isEnabled("checkout", "user123");

    expect(result).toBe(true);

    vi.unstubAllGlobals();
  });

  it("returns the fallback value when the API returns an error", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Internal server error",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const client = new FeatureFlagClient({
      baseUrl: "http://localhost:4000",
      environment: "staging",
      fallback: false,
    });

    const result = await client.isEnabled("checkout", "user123");

    expect(result).toBe(false);

    vi.unstubAllGlobals();
  });
});
