import { Router } from "express";
import { getAll, getByName, create, update, remove } from "../controllers/configController.js";

const router = Router();

router.get("/",          getAll);
router.get("/:name",     getByName);
router.post("/",         create);
router.put("/:name",     update);
router.delete("/:name",  remove);

export default router;
