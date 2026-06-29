import type { Request, Response, NextFunction } from "express";
import { issuesService } from "../services/issues.service";

export const issuesController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { neighborhood, status, category, page, limit } = req.query;
      const parsedPage = Math.max(1, parseInt(page as string) || 1);
      const parsedLimit = Math.min(
        100,
        Math.max(1, parseInt(limit as string) || 20),
      );
      const result = await issuesService.getAll({
        neighborhood: neighborhood as string,
        status: status as string,
        category: category as string,
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
};
