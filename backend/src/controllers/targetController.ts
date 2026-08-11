import { Request, Response } from "express";
import {
  addUserTarget,
  removeUserTarget,
  getUserTargets,
} from "../services/targetService";

export async function addTarget(req: Request, res: Response) {
  try {
    const keyParam = req.params.key;
    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;
    const { userId } = req.body;

    const target = await addUserTarget(key, userId);

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
    const userIdParam = req.params.userId;

    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;
    const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

    const result = await removeUserTarget(key, userId);

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
    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;

    const targets = await getUserTargets(key);

    return res.status(200).json(targets);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
