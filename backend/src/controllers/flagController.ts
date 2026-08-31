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
    const { key, description, actorId } = req.body;

    if (!key) {
      return res.status(400).json({
        message: "Flag key is required.",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Flag description is required.",
      });
    }

    const result = await createNewFlag({
      key,
      description,
      actorId,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}

export async function getFlags(_req: Request, res: Response) {
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
      return res.status(400).json({
        message: "Flag key is required.",
      });
    }

    const flag = await getSingleFlag(key);

    return res.status(200).json(flag);
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: error instanceof Error ? error.message : "Flag not found.",
    });
  }
}

export async function toggle(req: Request, res: Response) {
  try {
    const rawKey = req.params.key;
    const rawEnvironment = req.params.environment;

    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    const environment = Array.isArray(rawEnvironment)
      ? rawEnvironment[0]
      : rawEnvironment;

    const { enabled, actorId } = req.body;

    if (!key) {
      return res.status(400).json({
        message: "Flag key is required.",
      });
    }

    if (!environment) {
      return res.status(400).json({
        message: "Environment is required.",
      });
    }

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        message: "Enabled must be a boolean.",
      });
    }

    if (!actorId) {
      return res.status(400).json({
        message: "Actor ID is required.",
      });
    }

    const result = await toggleFlag(key, environment, enabled, actorId);

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
    const rawEnvironment = req.params.environment;

    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    const environment = Array.isArray(rawEnvironment)
      ? rawEnvironment[0]
      : rawEnvironment;

    const { rolloutPercentage, actorId } = req.body;

    if (!key) {
      return res.status(400).json({
        message: "Flag key is required.",
      });
    }

    if (!environment) {
      return res.status(400).json({
        message: "Environment is required.",
      });
    }

    if (rolloutPercentage === undefined || rolloutPercentage === null) {
      return res.status(400).json({
        message: "Rollout percentage is required.",
      });
    }

    if (!actorId) {
      return res.status(400).json({
        message: "Actor ID is required.",
      });
    }

    const result = await updateFlagRollout(
      key,
      environment,
      rolloutPercentage,
      actorId,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}
