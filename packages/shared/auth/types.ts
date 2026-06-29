export type AuthRole = "resident" | "moderator" | "admin" | "platform_admin";

export interface JwtPayload {
  userId: string;
  email: string;
  role: AuthRole;
  roles: AuthRole[];
  sessionId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  roles: AuthRole[];
}
