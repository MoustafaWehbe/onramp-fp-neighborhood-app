import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { adminService } from "../services/admin.service";

const router = Router();

// Read-only, available to any authenticated user (resident, moderator,
// admin, platform_admin) — used to populate neighborhood/category
// dropdowns on the report form and feed filters. Writing to these lists
// is still admin-only (see admin.routes.ts).
router.get("/neighborhoods", authenticate, async (_req, res, next) => {
  try {
    const neighborhoods = await adminService.getNeighborhoods();
    res.json({ data: neighborhoods });
  } catch (err) {
    next(err);
  }
});

router.get("/categories", authenticate, async (_req, res, next) => {
  try {
    const categories = await adminService.getCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

export { router as referenceRouter };
