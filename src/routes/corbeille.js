import { Router } from "express";
import { getAll, create, update, remove, getByIdTicket } from "../controllers/corbeilleController.js";

const router = Router();

router.get("/",          getAll);
router.get("/:idticket",     getByIdTicket);
router.post("/",         create);
router.put("/:id",     update);
router.delete("/:idticket",  remove);

export default router;
