import type { JwtPayload, TokenPair } from "./types";
export declare function signAccessToken(payload: JwtPayload): string;
export declare function signRefreshToken(payload: Pick<JwtPayload, "userId">): string;
export declare function verifyAccessToken(token: string): JwtPayload;
export declare function verifyRefreshToken(token: string): Pick<JwtPayload, "userId">;
export declare function generateTokenPair(payload: JwtPayload): TokenPair;
