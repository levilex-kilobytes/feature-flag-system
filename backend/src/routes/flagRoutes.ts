import { Router } from "express";
import { create, list, get, toggle } from "../controllers/flagController";

const router = Router();

router.post("/flags", create);

router.get("/flags", list);

router.get("/flags/:key", get);

router.patch("/flags/:key", toggle);

export default router;
