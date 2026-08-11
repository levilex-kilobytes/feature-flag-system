import { Request, Response } from "express";
import { evaluateFlag } from "../services/evaluationService";

export async function evaluate(req: Request, res: Response) {
  try {
    const rawKey = req.params.key;
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    const rawEnvironment = req.params.environment;

    const environment = Array.isArray(rawEnvironment)
      ? rawEnvironment[0]
      : rawEnvironment;

    const { userId } = req.query;

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

    if (typeof userId !== "string" || !userId) {
      return res.status(400).json({
        message: "userId is required.",
      });
    }

    const result = await evaluateFlag(key, userId, environment);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
}
