import { Router } from "express";
import { authRouter } from "./auth.routes";
import { issuesRouter } from "./issues.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/issues", issuesRouter);

export { router };
