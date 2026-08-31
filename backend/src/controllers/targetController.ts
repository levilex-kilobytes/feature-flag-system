import { Request, Response } from "express";
import {
  addUserTarget,
  removeUserTarget,
  getUserTargets,
} from "../services/targetService";

export async function addTarget(req: Request, res: Response) {
  try {
    const keyParam = req.params.key;
    const environmentParam = req.params.environment;

    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;

    const environment = Array.isArray(environmentParam)
      ? environmentParam[0]
      : environmentParam;

    const { userId, actorId } = req.body;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    if (!environment) {
      throw new Error("Environment is required.");
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    if (!actorId) {
      throw new Error("Actor ID is required.");
    }

    const target = await addUserTarget(key, environment, userId, actorId);

    return res.status(201).json(target);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function deleteTarget(req: Request, res: Response) {
  try {
    const keyParam = req.params.key;
    const environmentParam = req.params.environment;
    const userIdParam = req.params.userId;

    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;

    const environment = Array.isArray(environmentParam)
      ? environmentParam[0]
      : environmentParam;

    const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

    const { actorId } = req.body;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    if (!environment) {
      throw new Error("Environment is required.");
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    if (!actorId) {
      throw new Error("Actor ID is required.");
    }

    const result = await removeUserTarget(key, environment, userId, actorId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function listTargets(req: Request, res: Response) {
  try {
    const keyParam = req.params.key;
    const environmentParam = req.params.environment;

    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;

    const environment = Array.isArray(environmentParam)
      ? environmentParam[0]
      : environmentParam;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    if (!environment) {
      throw new Error("Environment is required.");
    }

    const targets = await getUserTargets(key, environment);

    return res.status(200).json(targets);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
