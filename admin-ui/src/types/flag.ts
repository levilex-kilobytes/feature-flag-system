export interface FlagEnvironment {
  id: string;
  flagId: string;
  environment: string;
  enabled: boolean;
  rolloutPercentage: number;
  createdAt: string;
}

export interface Flag {
  id: string;
  key: string;
  description: string;
  createdAt: string;
  environments: FlagEnvironment[];
}
export interface Target {
  id: string;
  flagEnvironmentId: string;
  userId: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  flagId: string;
  environment: string;
  actorId: string;
  changeType: string;
  beforeValue: Record<string, unknown> | null;
  afterValue: Record<string, unknown> | null;
  createdAt: string;
}
