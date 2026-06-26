import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requirePermission } from "../middleware/require-permission";
import { adminController } from "../controllers/admin.controller";

const router = Router();

router.patch(
  "/users/:userId/role",
  authenticate,
  requirePermission("admin:users:update-role"),
  adminController.updateUserRole
);

export { router as adminRouter };
