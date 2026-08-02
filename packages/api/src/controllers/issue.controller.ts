import type { Request, Response, NextFunction } from "express";
import { issuesService } from "../services/issues.service";

export const issuesController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { neighborhood, status, category, dateFrom, dateTo, page, limit } =
        req.query;
      const parsedPage = Math.max(1, parseInt(page as string) || 1);
      const parsedLimit = Math.min(
        100,
        Math.max(1, parseInt(limit as string) || 20),
      );
      const result = await issuesService.getAll({
        neighborhood: neighborhood as string,
        status: status as string,
        category: category as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        page: parsedPage,
        limit: parsedLimit,
      });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issue = await issuesService.getById(req.params.id as string);
      if (!issue) {
        res.status(404).json({ error: "Issue not found" });
        return;
      }
      res.status(200).json({ data: issue });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const issue = await issuesService.create({
        ...req.body,
        reportedById: req.user!.userId,
      });
      res.status(201).json({ data: issue });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issue = await issuesService.updateStatus(
        req.params.id as string,
        req.body.status,
        req.body.note,
        req.user!.userId,
      );
      if (!issue) {
        res.status(404).json({ error: "Issue not found" });
        return;
      }
      res.status(200).json({ data: issue });
    } catch (err) {
      next(err);
    }
  },

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string" || q.trim() === "") {
        res.status(400).json({ error: "Search query is required" });
        return;
      }
      const results = await issuesService.search(q.trim());
      res.status(200).json({ data: results });
    } catch (err) {
      next(err);
    }
  },

  async deleteIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const userRoles = req.user!.roles ?? [req.user!.role];
    await issuesService.deleteIssue(id, userId, userRoles);
    res.status(200).json({ data: { message: "Issue deleted" } });
  } catch (err: any) {
    if (err.message === "Not authorized to delete this issue") {
      res.status(403).json({ error: err.message });
      return;
    }
    next(err);
  }
},

  async categorize(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { description, categories } = req.body;

      if (!description || !categories || !Array.isArray(categories)) {
        res
          .status(400)
          .json({ error: "description and categories are required" });
        return;
      }

      const result = await issuesService.categorize(description, categories);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};
