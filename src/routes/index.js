import { Router } from "express";
import corbeilleRoutes from "./corbeille.js";

const router = Router();

router.use("/corbeille", corbeilleRoutes);

export default router;