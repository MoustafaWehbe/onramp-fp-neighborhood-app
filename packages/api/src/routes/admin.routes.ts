import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { requirePermission } from "../middleware/require-permission";
import { validate } from "../middleware/validate";
import { updateUserRoleSchema } from "../schemas/admin.schemas";
import { adminController } from "../controllers/admin.controller";

const router = Router();

router.get(
  "/roles",
  authenticate,
  requirePermission("admin:users:update-role"),
  adminController.getAssignableRoles
);

router.patch(
  "/users/:userId/role",
  authenticate,
  requirePermission("admin:users:update-role"),
  validate(updateUserRoleSchema),
  adminController.updateUserRole
);

router.get(
  "/users",
  authenticate,
  requirePermission("admin:users:read"),
  adminController.getUsers
);

export { router as adminRouter };
