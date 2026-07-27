import { Request, Response } from "express";
import { evaluateFlag } from "../services/evaluationService";

export async function evaluate(req: Request, res: Response) {
  try {
    const { flag, user } = req.query;

    if (!flag || !user) {
      return res.status(400).json({
        message: "flag and user are required",
      });
    }

    const result = await evaluateFlag(String(flag), String(user));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
