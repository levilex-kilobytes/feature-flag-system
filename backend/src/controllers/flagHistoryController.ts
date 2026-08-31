import { Request, Response } from "express";
import { getHistoryForFlag } from "../services/flagHistoryService";

export async function getFlagHistory(req: Request, res: Response) {
  try {
    const rawKey = req.params.key;

    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    if (!key) {
      throw new Error("Flag key is required.");
    }

    const history = await getHistoryForFlag(key);

    return res.status(200).json(history);
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}
