import type {
  Flag,
  FlagEnvironment,
  HistoryEntry,
  Target,
} from "../types/flag";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const text = await response.text();

  let data: unknown;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    if (typeof data === "object" && data !== null && "message" in data) {
      throw new Error(String((data as { message: unknown }).message));
    }

    throw new Error("Request failed.");
  }

  return data as T;
}

// Get all flags
export async function getFlags(): Promise<Flag[]> {
  return request<Flag[]>("/flags");
}

// Get one flag
export async function getFlag(key: string): Promise<Flag> {
  return request<Flag>(`/flags/${encodeURIComponent(key)}`);
}

// Create a flag
export async function createFlag(
  key: string,
  description: string,
  actorId: string,
) {
  return request("/flags", {
    method: "POST",
    body: JSON.stringify({
      key,
      description,
      actorId,
    }),
  });
}

// Toggle flag
export async function toggleFlag(
  key: string,
  environment: string,
  enabled: boolean,
  actorId: string,
) {
  return request(
    `/flags/${encodeURIComponent(key)}/${encodeURIComponent(environment)}/toggle`,
    {
      method: "PATCH",
      body: JSON.stringify({
        enabled,
        actorId,
      }),
    },
  );
}

// Update rollout percentage
export async function updateRollout(
  key: string,
  environment: string,
  rolloutPercentage: number,
  actorId: string,
) {
  return request(
    `/flags/${encodeURIComponent(key)}/${encodeURIComponent(environment)}/rollout`,
    {
      method: "PATCH",
      body: JSON.stringify({
        rolloutPercentage,
        actorId,
      }),
    },
  );
}

// Get targeted users
export async function getTargets(
  key: string,
  environment: string,
): Promise<Target[]> {
  return request<Target[]>(
    `/flags/${encodeURIComponent(key)}/${encodeURIComponent(environment)}/targets`,
  );
}

// Add targeted user
export async function addTarget(
  key: string,
  environment: string,
  userId: string,
) {
  return request(
    `/flags/${encodeURIComponent(key)}/${encodeURIComponent(environment)}/targets`,
    {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
    },
  );
}

// Remove targeted user
export async function removeTarget(
  key: string,
  environment: string,
  userId: string,
) {
  return request(
    `/flags/${encodeURIComponent(key)}/${encodeURIComponent(environment)}/targets/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
}

// Get flag history
export async function getHistory(key: string): Promise<HistoryEntry[]> {
  return request<HistoryEntry[]>(`/flags/${encodeURIComponent(key)}/history`);
}

export type { FlagEnvironment };
