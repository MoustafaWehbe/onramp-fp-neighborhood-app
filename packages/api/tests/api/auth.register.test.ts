import request from "supertest";
import { app } from "../../app";
import { authService } from "../../src/services/auth.service";

jest.mock("../../src/services/auth.service", () => ({
  authService: {
    register: jest.fn(),
  },
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  it("returns 201 when registration succeeds", async () => {
    mockAuthService.register.mockResolvedValue({
      id: "user-1",
      email: "elie@example.com",
      name: "Elie",
      role: "resident",
      roles: ["resident"],
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "elie@example.com",
      password: "SecurePass1",
      name: "Elie",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("elie@example.com");

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: "elie@example.com",
      password: "SecurePass1",
      name: "Elie",
    });
  });
});
