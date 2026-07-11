import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["resident", "moderator", "admin"]),
});

export const getAdminRolesSchema = z.object({});

export const createNeighborhoodSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  city: z.string().trim().max(120).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).optional(),
  department: z.string().trim().max(120).optional(),
});
