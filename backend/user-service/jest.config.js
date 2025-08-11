export default {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/models/**/*.js",
    "src/controllers/**/*.js",
    "src/util/**/*.js",
    "config/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!server.js", // Exclude server startup file
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "html", "lcov", "json"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/models/": {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    "./src/controllers/": {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/util/": {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.spec.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
