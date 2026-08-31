export interface FeatureFlagClientOptions {
  baseUrl: string;
  environment: string;
  fallback?: boolean;
}

export interface EvaluationResponse {
  flag: string;
  enabled: boolean;
  reason: string;
}
