// Global test setup — runs before each test file

// Silence console output during tests
global.console.info = jest.fn();
global.console.log = jest.fn();

process.env.NODE_ENV = "test";
process.env.REDIS = "false";

process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/starter_kit_test";
process.env.REDIS_URL = "redis://localhost:6379";
