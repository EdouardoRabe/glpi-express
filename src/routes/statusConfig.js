import { Router } from "express";
import { getAll, create, update, remove, getByIdTicket } from "../controllers/corbeilleController.js";

const router = Router();

router.get("/",          getAll);
router.post("/",         create);
router.put("/:code",     update);

export default router;
