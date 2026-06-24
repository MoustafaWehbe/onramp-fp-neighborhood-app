import crypto from "crypto";
import {
  hashPassword,
  verifyPassword,
  generateTokenPair,
  verifyRefreshToken,
} from "@starter-kit/shared";
import { User, Session, RefreshToken, Role, UserRole } from "../models";
import { createError } from "../middleware/error-handler";
import type { AuthRole } from "@starter-kit/shared";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  private async assignDefaultResidentRole(userId: string) {
    const residentRole = await Role.findOne({ where: { name: "resident" } });

    if (!residentRole) {
      throw createError("Default resident role not found", 500);
    }

    await UserRole.findOrCreate({
      where: {
        userId,
        roleId: residentRole.id,
      },
      defaults: {
        userId,
        roleId: residentRole.id,
      },
    });
  }

  private async getUserRoles(userId: string): Promise<AuthRole[]> {
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: "roles" }],
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    const roles = ((user as unknown as { roles?: Role[] }).roles ?? []).map(
      (role) => role.name as AuthRole
    );

    return roles;
  }

  private getPrimaryRole(roles: AuthRole[]): AuthRole {
    return roles[0] ?? "resident";
  }

  async register(input: RegisterInput) {
    const existing = await User.findOne({ where: { email: input.email } });
    if (existing) {
      throw createError("Email already in use", 409);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    await this.assignDefaultResidentRole(user.id);
    const roles = await this.getUserRoles(user.id);
    const role = this.getPrimaryRole(roles);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      roles,
    };
  }

  async login(input: LoginInput) {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) {
      throw createError("Invalid credentials", 401);
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw createError("Invalid credentials", 401);
    }

    const roles = await this.getUserRoles(user.id);
    const role = this.getPrimaryRole(roles);

    const session = await Session.create({
      userId: user.id,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000),
    });

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role,
      sessionId: session.id,
    });

    const tokenHash = crypto
      .createHash("sha256")
      .update(tokens.refreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user.id,
      sessionId: session.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
        roles,
      },
      ...tokens,
    };
  }

  async refresh(rawToken: string) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const stored = await RefreshToken.findOne({ where: { tokenHash } });
    if (!stored || !stored.isValid) {
      throw createError("Invalid or expired refresh token", 401);
    }

    const payload = verifyRefreshToken(rawToken);
    const user = await User.findByPk(payload.userId);
    if (!user) throw createError("User not found", 404);

    await stored.update({ revokedAt: new Date() });

    const session = await Session.findByPk(stored.sessionId);
    if (!session) throw createError("Session not found", 401);

    const roles = await this.getUserRoles(user.id);
    const role = this.getPrimaryRole(roles);

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role,
      sessionId: session.id,
    });

    const newHash = crypto
      .createHash("sha256")
      .update(tokens.refreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user.id,
      sessionId: session.id,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000),
    });

    return tokens;
  }

  async logout(sessionId: string) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { sessionId } }
    );
    await Session.destroy({ where: { id: sessionId } });
  }

  async getProfile(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "name", "emailVerified", "createdAt"],
    });

    if (!user) throw createError("User not found", 404);

    const roles = await this.getUserRoles(user.id);
    const role = this.getPrimaryRole(roles);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      role,
      roles,
    };
  }
}

export const authService = new AuthService();
