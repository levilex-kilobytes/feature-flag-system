import { Router } from "express";
import {
  createFlag,
  getFlags,
  getFlag,
  toggle,
  updateRollout,
} from "../controllers/flagController";

const router = Router();

router.post("/", createFlag);

router.get("/", getFlags);

router.get("/:key", getFlag);

router.patch("/:key/toggle", toggle);

router.patch("/:key/rollout", updateRollout);

export default router;
