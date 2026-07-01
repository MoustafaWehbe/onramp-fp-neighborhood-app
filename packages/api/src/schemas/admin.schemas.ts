import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["resident", "moderator", "admin"]),
});

export const getAdminRolesSchema = z.object({});
