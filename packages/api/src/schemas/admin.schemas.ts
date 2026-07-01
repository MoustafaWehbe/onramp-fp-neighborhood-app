import { z } from "zod";

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user id"),
  }),
  body: z.object({
    role: z.enum(["resident", "moderator", "admin"]),
  }),
});

export const getAdminRolesSchema = z.object({});
