import { Request, Response } from "express";
import {
  createNewFlag,
  getAllFlags,
  getSingleFlag,
  toggleFlag,
  updateFlagRollout,
} from "../services/flagService";

export async function createFlag(req: Request, res: Response) {
  try {
    const result = await createNewFlag(req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}

export async function getFlags(req: Request, res: Response) {
  try {
    const flags = await getAllFlags();

    return res.status(200).json(flags);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}

export async function getFlag(req: Request, res: Response) {
  try {
    const rawKey = req.params.key;
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    const flag = await getSingleFlag(key);

    return res.status(200).json(flag);
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}

export async function toggle(req: Request, res: Response) {
  try {
    const rawKey = req.params.key;
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    const rawEnvironment = req.params.environment;

    const environment = Array.isArray(rawEnvironment)
      ? rawEnvironment[0]
      : rawEnvironment;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    if (!environment) {
      throw new Error("Environment is required.");
    }

    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      throw new Error("enabled must be a boolean.");
    }

    const result = await toggleFlag(key, environment, enabled);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}

export async function updateRollout(req: Request, res: Response) {
  try {
    const rawKey = req.params.key;
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    const rawEnvironment = req.params.environment;

    const environment = Array.isArray(rawEnvironment)
      ? rawEnvironment[0]
      : rawEnvironment;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    if (!environment) {
      throw new Error("Environment is required.");
    }

    const { rolloutPercentage } = req.body;

    const result = await updateFlagRollout(key, environment, rolloutPercentage);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}
