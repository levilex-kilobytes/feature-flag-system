import {
  createFlag,
  getFlags,
  getFlagByKey,
  updateFlag,
} from "../repositories/flagRepository";

export async function createNewFlag(
  key: string,
  description: string,
  actor: string,
) {
  const existing = await getFlagByKey(key);

  if (existing) {
    throw new Error("FLAG_ALREADY_EXISTS");
  }

  return createFlag({
    key,
    description,
  });
}

export async function listFlags() {
  return getFlags();
}

export async function findFlag(key: string) {
  return getFlagByKey(key);
}

export async function toggleFlag(key: string, enabled: boolean, actor: string) {
  return updateFlag(key, enabled);
}
