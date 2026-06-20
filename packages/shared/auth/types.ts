export interface JwtPayload {
  userId: string;
  email: string;
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
  googleId: string;
  avatarUrl: string | null;
}
