import { Router } from "express";
import corbeilleRoutes from "./corbeille.js";
import statusRoutes from "./status.js";

const router = Router();

router.use("/corbeille", corbeilleRoutes);
router.use("/status", statusRoutes);

export default router;