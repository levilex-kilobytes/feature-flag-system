import {
  createFlag,
  getFlags,
  getFlagByKey,
  updateFlag,
  updateRolloutPercentage,
} from "../repositories/flagRepository";

export async function createNewFlag(data: {
  key: string;
  description: string;
  actorId?: string;
}) {
  const existingFlag = await getFlagByKey(data.key);

  if (existingFlag) {
    throw new Error("Flag key already exists.");
  }

  const [flag] = await createFlag({
    key: data.key,
    description: data.description,
    enabled: false,
  });

  return {
    message: "Flag created successfully.",
    flag,
  };
}

export async function getAllFlags() {
  return getFlags();
}

export async function getSingleFlag(key: string) {
  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  return flag;
}

export async function toggleFlag(key: string, enabled: boolean) {
  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  const [updatedFlag] = await updateFlag(key, enabled);

  return {
    message: "Flag updated successfully.",
    flag: updatedFlag,
  };
}

export async function updateFlagRollout(
  key: string,
  rolloutPercentage: number,
) {
  const percentage = Number(rolloutPercentage);

  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new Error("Rollout percentage must be between 0 and 100.");
  }

  const flag = await getFlagByKey(key);

  if (!flag) {
    throw new Error("Flag not found.");
  }

  const updatedFlag = await updateRolloutPercentage(key, percentage);

  return {
    message: "Rollout percentage updated successfully.",
    flag: updatedFlag,
  };
}
