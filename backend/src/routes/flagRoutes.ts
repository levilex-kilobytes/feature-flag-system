import { Router } from "express";
import {
  createFlag,
  getFlags,
  getFlag,
  toggle,
  updateRollout,
} from "../controllers/flagController";
import { getFlagHistory } from "../controllers/flagHistoryController";

const router = Router();

router.post("/", createFlag);

router.get("/", getFlags);

router.get("/:key/history", getFlagHistory);

router.get("/:key", getFlag);

router.patch("/:key/:environment/toggle", toggle);

router.patch("/:key/:environment/rollout", updateRollout);

export default router;
