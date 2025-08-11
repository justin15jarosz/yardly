import { jest } from "@jest/globals";
import UserRepository from "../../src/repository/userRepository";
import db from "../../src/config/database";
import User from "../../src/models/user";

jest.mock("../../src/config/database");

describe("Create User - Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UserRepository.create()", () => {
    test("should create a new user and return a User instance", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        name: "Test User",
      };
      const mockResult = {
        rows: [
          {
            user_id: "uuid-123",
            email: "test@example.com",
            name: "Test User",
            created_at: new Date(),
            is_verified: false,
          },
        ],
      };

      db.query.mockResolvedValue(mockResult);

      // Act
      const result = await UserRepository.create(userData);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        ["test@example.com", "Test User", false]
      );
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe("test@example.com");
    });
  });

  describe("SQL Injection Prevention", () => {
    test("should handle special characters safely within name", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        name: "O'Malley; DROP TABLE users; --",
      };
      const mockResult = {
        rows: [
          {
            user_id: "uuid-123",
            email: "test@example.com",
            name: "O'Malley; DROP TABLE users; --",
            created_at: new Date(),
            is_verified: false,
          },
        ],
      };

      db.query.mockResolvedValue(mockResult);

      // Act
      const result = await UserRepository.create(userData);

      // Assert
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        ["test@example.com", "O'Malley; DROP TABLE users; --", false]
      );
      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe("O'Malley; DROP TABLE users; --");
      expect(result.email).toBe("test@example.com");
    });
  });
});
