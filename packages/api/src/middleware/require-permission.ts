//packages/api/src/middleware/require-permission.ts

import type { Request, Response, NextFunction } from "express";
import { User, Role, Permission } from "../models";

export function requirePermission(permissionName: string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthenticated" });
        return;
      }

      const user = await User.findByPk(req.user.userId, {
        include: [
          {
            model: Role,
            as: "roles",
            include: [
              {
                model: Permission,
                as: "permissions",
                where: { name: permissionName },
                required: true,
              },
            ],
          },
        ],
      });

      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      const roles = (user as unknown as { roles?: Role[] }).roles ?? [];

      if (roles.length === 0) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
