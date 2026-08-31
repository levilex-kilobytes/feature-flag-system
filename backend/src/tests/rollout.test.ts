import { describe, expect, it } from "vitest";
import { getRolloutBucket } from "../utils/rolloutHash";

describe("Consistent rollout", () => {
  it("returns the same bucket for the same user and flag", () => {
    const first = getRolloutBucket("user123", "checkout");

    const second = getRolloutBucket("user123", "checkout");

    expect(first).toBe(second);
  });

  it("returns the same bucket across many evaluations", () => {
    const results = Array.from({ length: 100 }, () =>
      getRolloutBucket("user123", "checkout"),
    );

    expect(new Set(results).size).toBe(1);
  });

  it("includes the flag key in the hash", () => {
    const checkout = getRolloutBucket("user123", "checkout");

    const payments = getRolloutBucket("user123", "payments");

    expect(checkout).not.toBe(payments);
  });

  it("produces buckets between 0 and 99", () => {
    for (let i = 0; i < 1000; i++) {
      const bucket = getRolloutBucket(`user-${i}`, "checkout");

      expect(bucket).toBeGreaterThanOrEqual(0);
      expect(bucket).toBeLessThan(100);
    }
  });

  it("approximately matches a 50% rollout across a large population", () => {
    const users = 10000;

    let included = 0;

    for (let i = 0; i < users; i++) {
      const bucket = getRolloutBucket(`user-${i}`, "checkout");

      if (bucket < 50) {
        included++;
      }
    }

    const percentage = (included / users) * 100;

    expect(percentage).toBeGreaterThan(45);
    expect(percentage).toBeLessThan(55);
  });

  it("gives different users different buckets", () => {
    const buckets = new Set<number>();

    for (let i = 0; i < 100; i++) {
      buckets.add(getRolloutBucket(`user-${i}`, "checkout"));
    }

    expect(buckets.size).toBeGreaterThan(1);
  });

  it("keeps previously included users when rollout increases", () => {
    for (let i = 0; i < 1000; i++) {
      const bucket = getRolloutBucket(`user-${i}`, "checkout");

      const includedAt30 = bucket < 30;
      const includedAt60 = bucket < 60;

      if (includedAt30) {
        expect(includedAt60).toBe(true);
      }
    }
  });
});
