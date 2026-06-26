import type { Request, Response, NextFunction } from "express";
import type { AuthRole } from "@starter-kit/shared";

export function authorize(...allowedRoles: AuthRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthenticated" });
      return;
    }

    const userRoles: AuthRole[] = req.user.roles ?? [req.user.role];
    if (
      allowedRoles.length > 0 &&
      !userRoles.some((role) => allowedRoles.includes(role))
    ) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
