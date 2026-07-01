import request from "supertest";
import { app } from "../../app";

jest.mock("../../src/lib/db", () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  getDatabase: jest.fn(),
}));

jest.mock("../../src/services/auth.service", () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  },
}));

import { authService } from "../../src/services/auth.service";

const mockAuthService = authService as jest.Mocked<typeof authService>;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  it("returns 201 with user data on success", async () => {
    mockAuthService.register.mockResolvedValue({
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "resident",
      roles: ["resident"],
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "SecurePass1",
      name: "Alice",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("alice@example.com");
    expect(mockAuthService.register).toHaveBeenCalledTimes(1);
  });

  it("returns 422 when email is invalid", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      password: "SecurePass1",
      name: "Alice",
    });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe("email");
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it("returns 422 when password is too weak", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "short",
      name: "Alice",
    });

    expect(res.status).toBe(422);
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  it("returns 200 and sets authentication cookies on valid credentials", async () => {
    mockAuthService.login.mockResolvedValue({
      user: {
        id: "uuid-1",
        email: "alice@example.com",
        name: "Alice",
        role: "resident",
        roles: ["resident"],
      },
      accessToken: "access.token.here",
      refreshToken: "refresh.token.here",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "SecurePass1",
    });

    expect(res.status).toBe(200);

    expect(res.body.data.user.email).toBe("alice@example.com");
    expect(res.body.data.user.role).toBe("resident");

    expect(res.headers["set-cookie"]).toBeDefined();

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
  });

  it("returns 422 when body is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(422);
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});
