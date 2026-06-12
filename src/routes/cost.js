import { Router } from "express";
import { getAll, create, remove, reouvrir } from "../controllers/costController.js";

const router = Router();

router.get("/",          getAll);
router.post("/",         create);
router.delete("/remove/:id_ticket", remove);
router.post("/ouvrir/:id_ticket", reouvrir);

export default router;
