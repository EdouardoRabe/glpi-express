import { Router } from "express";
import corbeilleRoutes from "./corbeille.js";
import statusRoutes from "./status.js";
import statusConfigRoutes from "./statusConfig.js";

const router = Router();

router.use("/corbeille", corbeilleRoutes);
router.use("/status", statusRoutes);
router.use("/statusConfig", statusConfigRoutes);

export default router;