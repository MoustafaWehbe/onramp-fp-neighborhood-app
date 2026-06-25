import type { Request, Response, NextFunction } from "express";
import { commentsService } from "../services/comments.service";

export const commentsController = {
  async getByIssueId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const comments = await commentsService.getByIssueId(
        req.params.id as string
      );
      res.status(200).json({ data: comments });
    } catch (err) {
      next(err);
    }
  },

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const comment = await commentsService.create({
        issueId: req.params.id as string,
        authorId: req.user!.userId,
        body: req.body.body,
        requestingUserId: req.user!.userId,
      });
      res.status(201).json({ data: comment });
    } catch (err) {
      next(err);
    }
  },
};