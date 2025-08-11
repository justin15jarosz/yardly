import { validateUser, validateUUID } from "../../src/util/validateUser.js";

describe("Validate User - Happy Path", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("validateUser()", () => {
    test("should pass validation with valid user data", () => {
      // Arrange
      mockReq.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("validateUUID()", () => {
    test("should pass validation with valid UUID", () => {
      // Arrange
      mockReq.params.user_id = "123e4567-e89b-12d3-a456-426614174000";

      // Act
      validateUUID(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("Validate User - Edge Cases", () => {
    test("should accept name with 2 characters", () => {
      // Arrange
      mockReq.body = {
        name: "AB",
        email: "test@example.com",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test("should accept name with 100 characters", () => {
      // Arrange
      mockReq.body = {
        name: "A".repeat(100),
        email: "test@example.com",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test("should handle very long email (255 characters)", () => {
      // Arrange
      const longEmail = "a".repeat(240) + "@example.com";
      mockReq.body = {
        name: "A".repeat(100),
        email: longEmail,
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test("should handle Unicode characters in name", () => {
      // Arrange
      mockReq.body = {
        name: "José María 李明",
        email: "test@example.com",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("Validate User - Error Handling", () => {
    test("should reject missing email", async () => {
      // Arrange
      mockReq.body = {
        name: "Test User",
        // Missing name
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Name and Email are required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("should reject missing name", () => {
      // Arrange
      mockReq.body = {
        email: "test@example.com",
        // Missing name
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Name and Email are required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("should reject short name in validateUser", () => {
      // Arrange
      mockReq.body = {
        name: "A",
        email: "test@example.com",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Name must be at least 2 characters long",
      });
    });

    test("should reject long name in validateUser", () => {
      // Arrange
      mockReq.body = {
        name: "A".repeat(101),
        email: "test@example.com",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Name cannot exceed 100 characters",
      });
    });

    test("should reject invalid email in validateUser", () => {
      // Arrange
      mockReq.body = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      };

      // Act
      validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid email format",
      });
    });
  });
});
