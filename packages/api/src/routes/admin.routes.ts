import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { requirePermission } from "../middleware/require-permission";
import { validate } from "../middleware/validate";
import {
  updateUserRoleSchema,
  createNeighborhoodSchema,
  createCategorySchema,
} from "../schemas/admin.schemas";
import { adminController } from "../controllers/admin.controller";

const router = Router();

// Admin console — neighborhoods and categories are readable by admin-tier
// roles only, and writable via the already-seeded admin:*:create permissions.
router.get(
  "/neighborhoods",
  authenticate,
  authorize("admin", "platform_admin"),
  adminController.getNeighborhoods
);

router.delete(
  "/neighborhoods/:id",
  authenticate,
  authorize("admin", "platform_admin"),
  adminController.deleteNeighborhood
);

router.delete(
  "/categories/:id",
  authenticate,
  authorize("admin", "platform_admin"),
  adminController.deleteCategory
);

router.post(
  "/neighborhoods",
  authenticate,
  requirePermission("admin:neighborhoods:create"),
  validate(createNeighborhoodSchema),
  adminController.createNeighborhood
);

router.get(
  "/categories",
  authenticate,
  authorize("admin", "platform_admin"),
  adminController.getCategories
);

router.post(
  "/categories",
  authenticate,
  requirePermission("admin:categories:create"),
  validate(createCategorySchema),
  adminController.createCategory
);

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

router.patch(
  "/users/:id/neighborhood",
  authenticate,
  authorize("admin", "platform_admin"),
  adminController.assignNeighborhood
);

export { router as adminRouter };
