import { Request, Response } from "express";

export function create(req: Request, res: Response) {
  res.json({
    message: "create flag",
  });
}

export function list(req: Request, res: Response) {
  res.json({
    message: "list flags",
  });
}

export function get(req: Request, res: Response) {
  res.json({
    message: "get flag",
  });
}

export function toggle(req: Request, res: Response) {
  res.json({
    message: "toggle flag",
  });
}
