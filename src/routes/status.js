import { Router } from "express";
import { getAll, create, update, remove, getByIdStatus, getLanguages } from "../controllers/statusController.js";

const router = Router();

router.get("/",          getAll);
router.get("/languages",   getLanguages);
router.get("/:id_status",     getByIdStatus);
router.post("/",         create);
router.put("/:id_status",     update);
router.delete("/:id_status",  remove);

export default router;
