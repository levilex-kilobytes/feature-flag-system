import { FeatureFlagClientOptions, EvaluationResponse } from "./types";

export class FeatureFlagClient {
  private readonly baseUrl: string;
  private readonly environment: string;
  private readonly fallback: boolean;

  constructor(options: FeatureFlagClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.environment = options.environment;
    this.fallback = options.fallback ?? false;
  }

  async isEnabled(flagKey: string, userId: string): Promise<boolean> {
    try {
      const url =
        `${this.baseUrl}/evaluate/` +
        `${encodeURIComponent(flagKey)}/` +
        `${encodeURIComponent(this.environment)}` +
        `?userId=${encodeURIComponent(userId)}`;

      const response = await fetch(url);

      if (!response.ok) {
        return this.fallback;
      }

      const result = (await response.json()) as EvaluationResponse;

      return result.enabled;
    } catch {
      return this.fallback;
    }
  }
}
