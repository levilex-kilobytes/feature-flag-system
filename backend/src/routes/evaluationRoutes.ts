import { Router } from "express";
import { evaluate } from "../controllers/evaluationController";

const router = Router();

router.get("/:key/:environment", evaluate);

export default router;
