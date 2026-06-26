import { Router } from "express";
import { issuesController } from "../controllers/issue.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { commentsController } from "../controllers/comments.controller";
const router = Router();

// All issue routes require login
router.use(authenticate);

// GET /api/issues — anyone logged in can view the feed
router.get("/", issuesController.getAll);

// GET /api/issues/:id — anyone logged in can view one issue
router.get("/:id", issuesController.getById);

// POST /api/issues — only residents can submit issues
router.post("/", authorize("user"), issuesController.create);

// PATCH /api/issues/:id/status — only city workers can update status
router.patch(
  "/:id/status",
  authorize("authority"),
  issuesController.updateStatus,
);

// Comments routes
// GET /api/issues/:id/comments — anyone logged in can view comments for an issue
router.get("/:id/comments", commentsController.getByIssueId);
router.post("/:id/comments", authorize("user", "authority"), commentsController.create);

export default router;
