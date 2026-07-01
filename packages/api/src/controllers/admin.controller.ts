import type { Request, Response, NextFunction } from "express";
import { Role, User, UserRole } from "../models";

const assignableRoles = ["resident", "moderator", "admin"] as const;
type AssignableRole = (typeof assignableRoles)[number];

function getRoleNames(user: unknown): string[] {
  return ((user as { roles?: Role[] }).roles ?? []).map((role) => role.name);
}

function getPrimaryRole(roles: string[]): string {
  if (roles.includes("platform_admin")) return "platform_admin";
  if (roles.includes("admin")) return "admin";
  if (roles.includes("moderator")) return "moderator";
  return "resident";
}

async function getUserRoleNames(userId: string): Promise<string[]> {
  const user = await User.findByPk(userId, {
    include: [{ model: Role, as: "roles" }],
  });

  if (!user) {
    return [];
  }

  return getRoleNames(user);
}

function getAssignableRolesForActor(actorRole: string): AssignableRole[] {
  if (actorRole === "platform_admin") {
    return ["resident", "moderator", "admin"];
  }

  if (actorRole === "admin") {
    return ["resident", "moderator"];
  }

  return [];
}

export const adminController = {
  async getAssignableRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthenticated" });
        return;
      }

      const actorRoles = await getUserRoleNames(req.user.userId);
      const actorPrimaryRole = getPrimaryRole(actorRoles);
      const roles = getAssignableRolesForActor(actorPrimaryRole);

      if (roles.length === 0) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      res.json({
        data: roles.map((role) => ({
          value: role,
          label:
            role === "resident"
              ? "Resident"
              : role === "moderator"
                ? "Authority Representative"
                : "Admin",
        })),
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthenticated" });
        return;
      }

      const userId = String(req.params.userId);
      const { role } = req.body as { role?: AssignableRole };

      if (!role || !assignableRoles.includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }

      const actorRoles = await getUserRoleNames(req.user.userId);
      const actorPrimaryRole = getPrimaryRole(actorRoles);
      const actorAssignableRoles = getAssignableRolesForActor(actorPrimaryRole);

      if (!actorAssignableRoles.includes(role)) {
        res.status(403).json({ error: "You cannot assign this role" });
        return;
      }

      const targetUser = await User.findByPk(userId, {
        include: [{ model: Role, as: "roles" }],
      });

      if (!targetUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const targetRoles = getRoleNames(targetUser);
      const targetPrimaryRole = getPrimaryRole(targetRoles);

      if (targetPrimaryRole === "platform_admin") {
        res.status(403).json({ error: "Platform admin cannot be modified" });
        return;
      }

      if (
        actorPrimaryRole === "admin" &&
        (targetPrimaryRole === "admin" ||
          targetPrimaryRole === "platform_admin")
      ) {
        res.status(403).json({ error: "Admins cannot modify other admins" });
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
        assignedBy: req.user.userId,
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
