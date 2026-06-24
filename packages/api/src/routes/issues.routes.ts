import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { authenticate } from "src/middleware/authenticate";
import { Issue } from "../models/Issue";
import { Comment } from "../models/Comment";
import { User } from "../models/User";

const router = Router();

// GET /issues — paginated feed with filters
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { neighborhood, status, category, page = "1" } = req.query;
    const limit = 10;
    const offset = (parseInt(page as string) - 1) * limit;

    const where: Record<string, string> = {};
    if (neighborhood) where.neighborhood = neighborhood as string;
    if (status) where.status = status as string;
    if (category) where.category = category as string;

    const { count, rows } = await Issue.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "submittedBy", attributes: ["id", "name"] },
        { model: Comment, as: "comments", attributes: ["id"] },
      ],
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page as string),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /issues/:id/comments
router.get(
  "/:id/comments",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const issueId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const comments = await Comment.findAll({
        where: { issueId },
        order: [["createdAt", "ASC"]],
        include: [{ model: User, as: "author", attributes: ["id", "name"] }],
      });

      res.json({ data: comments });
    } catch (err) {
      next(err);
    }
  },
);

// POST /issues/:id/comments
router.post(
  "/:id/comments",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const issueId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const issue = await Issue.findByPk(issueId);

      if (!issue) {
        res.status(404).json({ error: "Issue not found" });
        return;
      }

      // residents can only comment on their own issues
      const userRole = (req.user as any)?.role;
      if (userRole === "Resident" && issue.submittedById !== req.user!.userId) {
        res
          .status(403)
          .json({ error: "Residents can only comment on their own issues" });
        return;
      }

      const comment = await Comment.create({
        body: req.body.body,
        issueId,
        authorId: req.user!.userId,
      });

      res.status(201).json({ data: comment });
    } catch (err) {
      next(err);
    }
  },
);

export { router as issuesRouter };
