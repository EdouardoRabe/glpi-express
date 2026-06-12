import { Router } from "express";
import corbeilleRoutes from "./corbeille.js";
import statusRoutes from "./status.js";
import statusConfigRoutes from "./statusConfig.js";
import costRoutes from "./cost.js";

const router = Router();

router.use("/corbeille", corbeilleRoutes);
router.use("/status", statusRoutes);
router.use("/statusConfig", statusConfigRoutes);
router.use("/cost", costRoutes);

export default router;