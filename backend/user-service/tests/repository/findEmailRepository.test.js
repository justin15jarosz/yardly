import { jest } from "@jest/globals";
import UserRepository from "../../src/repository/userRepository";
import db from "../../src/config/database";

jest.mock("../../src/config/database");

describe("Find By Email - Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UserRepository.findByEmail()", () => {
    test("should find user by email", async () => {
      // Arrange
      const mockResult = {
        rows: [
          {
            user_id: "uuid-123",
            email: "test@example.com",
            name: "Test User",
            created_at: new Date(),
            is_verified: true,
          },
        ],
      };
      db.query.mockResolvedValue(mockResult);

      // Act
      const result = await UserRepository.findByEmail("test@example.com");

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [
        "test@example.com",
      ]);
      expect(result.email).toBe("test@example.com");
    });
  });
});
