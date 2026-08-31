import { Router } from "express";

import {
  addTarget,
  deleteTarget,
  listTargets,
} from "../controllers/targetController";

const router = Router();

router.post("/:key/:environment/targets", addTarget);

router.get("/:key/:environment/targets", listTargets);

router.delete("/:key/:environment/targets/:userId", deleteTarget);

export default router;
