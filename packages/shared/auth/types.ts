export type AuthRole = "resident" | "city_worker" | "platform_admin";

export interface JwtPayload {
  userId: string;
  email: string;
  role: AuthRole;
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
}
