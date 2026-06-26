import { Router } from "express";
import { authRouter } from "./auth.routes";
import { adminRouter } from "./admin.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);

export { router };
