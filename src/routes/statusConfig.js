import { Router } from "express";
import { getAll, create, update } from "../controllers/statusConfigController.js";

const router = Router();

router.get("/",          getAll);
router.post("/",         create);
router.put("/:code",     update);

export default router;
