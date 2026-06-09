import { Router } from "express";
import { getAll, create, update, remove, getByIdTicket, getByIdStatus } from "../controllers/statusController.js";

const router = Router();

router.get("/",          getAll);
router.get("/:id_status",     getByIdStatus);
router.post("/",         create);
router.put("/:id_status",     update);
router.delete("/:id_status",  remove);

export default router;
