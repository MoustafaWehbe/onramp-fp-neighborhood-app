import { Router } from "express";
import { authRouter } from "./auth.routes";
import issuesRoutes from "./issues.routes";
const router = Router();

router.use("/auth", authRouter);
router.use("/issues", issuesRoutes);
// Add more routers here:
// router.use('/users', usersRouter);

export { router };
