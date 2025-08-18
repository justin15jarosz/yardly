import db from "../src/config/database.js";

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test";
  process.env.DB_NAME = "yardly";
});

// Global test teardown
afterAll(async () => {
  await db.close()
});

// Increase timeout for integration tests
jest.setTimeout(15000);

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
