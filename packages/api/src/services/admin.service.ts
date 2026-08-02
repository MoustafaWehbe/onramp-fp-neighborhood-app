import { User, Role } from "../models";
import { Neighborhood, Category } from "@starter-kit/shared";

function getRoleNames(user: unknown): string[] {
  return ((user as { roles?: Role[] }).roles ?? []).map((role) => role.name);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
      attributes: ["id", "email", "name", "emailVerified", "createdAt", "assignedNeighborhood"],
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
        assignedNeighborhood: user.assignedNeighborhood ?? null,
      };
    });
  },

  async getNeighborhoods() {
    return Neighborhood.findAll({ order: [["name", "ASC"]] });
  },

  async createNeighborhood(data: { name: string; city?: string }) {
    const slug = slugify(data.name);

    const existing = await Neighborhood.findOne({ where: { slug } });
    if (existing) {
      throw new Error("A neighborhood with this name already exists");
    }

    return Neighborhood.create({
      name: data.name,
      slug,
      city: data.city || "Unspecified",
    });
  },

  async assignNeighborhoodToWorker(
    userId: string,
    neighborhood: string | null,
  ) {
    const { User } = await import("@starter-kit/shared");
    await User.update(
      { assignedNeighborhood: neighborhood },
      { where: { id: userId } },
    );
  },

  async deleteNeighborhood(id: string) {
    const { Neighborhood } = await import("@starter-kit/shared");
    await Neighborhood.destroy({ where: { id } });
  },

  async deleteCategory(id: string) {
    const { Category } = await import("@starter-kit/shared");
    await Category.destroy({ where: { id } });
  },

  async getCategories() {
    return Category.findAll({ order: [["name", "ASC"]] });
  },

  async createCategory(data: {
    name: string;
    description?: string;
    department?: string;
  }) {
    const slug = slugify(data.name);

    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      throw new Error("A category with this name already exists");
    }

    return Category.create({
      name: data.name,
      slug,
      description: data.description ?? null,
      department: data.department ?? null,
      embedding: null,
    });
  },
};
