import { Router } from "express";
import { getAll, create, update, remove, getByIdTicket } from "../controllers/corbeilleController.js";

const router = Router();

router.get("/",          getAll);
router.get("/:id",     getByIdTicket);
router.post("/",         create);
router.put("/:id",     update);
router.delete("/:id",  remove);

export default router;
