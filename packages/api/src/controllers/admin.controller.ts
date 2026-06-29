import type { Request, Response, NextFunction } from "express";
import { Role, UserRole } from "../models";

const allowedRoles = ["resident", "moderator", "admin", "platform_admin"];

export const adminController = {
  async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = String(req.params.userId);
      const { role } = req.body as { role?: string };

      if (!role || !allowedRoles.includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }

      const targetRole = await Role.findOne({ where: { name: role } });

      if (!targetRole) {
        res.status(404).json({ error: "Role not found" });
        return;
      }

      await UserRole.destroy({ where: { userId } });

      await UserRole.create({
        userId,
        roleId: targetRole.id,
        assignedBy: req.user?.userId,
        assignedAt: new Date(),
      });

      res.json({
        data: {
          userId,
          role,
          message: "User role updated successfully",
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
