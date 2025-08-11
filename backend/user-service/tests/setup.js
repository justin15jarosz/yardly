import db from "../src/config/database.js";

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test";
  process.env.DB_NAME = "yardly";

  // Initialize test database
  try {
    await db.initTables();
  } catch (error) {
    console.error("Test setup failed:", error);
    process.exit(1);
  }
});

// Global test teardown
afterAll(async () => {
  try {
    await db.close();
  } catch (error) {
    console.error("Test teardown failed:", error);
  }
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
