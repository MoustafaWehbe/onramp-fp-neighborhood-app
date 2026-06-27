"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.generateTokenPair = generateTokenPair;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getSecret(envKey, fallback) {
    const value = process.env[envKey];
    if (!value && process.env.NODE_ENV === "production") {
        throw new Error(`Missing required env var: ${envKey}`);
    }
    return value ?? fallback;
}
function signAccessToken(payload) {
    const secret = getSecret("JWT_SECRET", "dev-access-secret");
    const expiresIn = process.env.JWT_EXPIRES_IN ?? "15m";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
function signRefreshToken(payload) {
    const secret = getSecret("JWT_REFRESH_SECRET", "dev-refresh-secret");
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
function verifyAccessToken(token) {
    const secret = getSecret("JWT_SECRET", "dev-access-secret");
    return jsonwebtoken_1.default.verify(token, secret);
}
function verifyRefreshToken(token) {
    const secret = getSecret("JWT_REFRESH_SECRET", "dev-refresh-secret");
    return jsonwebtoken_1.default.verify(token, secret);
}
function generateTokenPair(payload) {
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken({ userId: payload.userId }),
    };
}
//# sourceMappingURL=jwt.js.map