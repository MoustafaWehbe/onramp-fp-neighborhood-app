import { Router } from "express";
import { authRouter } from "./auth.routes";
import { adminRouter } from "./admin.routes";
import { referenceRouter } from "./reference.routes";
import issuesRoutes from "./issues.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/", referenceRouter);
router.use("/issues", issuesRoutes);

export { router };
