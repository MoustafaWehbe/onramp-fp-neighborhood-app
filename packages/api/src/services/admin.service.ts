import { User, Role } from "../models";

function getRoleNames(user: unknown): string[] {
  return ((user as { roles?: Role[] }).roles ?? []).map((role) => role.name);
}

function getPrimaryRole(roles: string[]): string {
  if (roles.includes("platform_admin")) return "platform_admin";
  if (roles.includes("admin")) return "admin";
  if (roles.includes("moderator")) return "moderator";
  return "resident";
}

export const adminService = {
  async getUsers() {
    const users = await User.findAll({
      attributes: ["id", "email", "name", "emailVerified", "createdAt"],
      include: [{ model: Role, as: "roles" }],
      order: [["createdAt", "DESC"]],
    });

    return users.map((user) => {
      const roles = getRoleNames(user);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        role: getPrimaryRole(roles),
        roles,
      };
    });
  },
};
