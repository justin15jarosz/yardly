import { jest } from "@jest/globals";
import UserRepository from "../../src/repository/userRepository.js";
import userController from "../../src/controllers/userController.js";
import User from "../../src/models/user.js";

jest.mock("../../src/repository/userRepository");
jest.mock("../../src/models/user.js");

describe("Create User - Controller", () => {
  let mockReq, mockRes;

  beforeEach(async () => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createUser()", () => {
    test("should create user successfully", async () => {
      // Arrange
      mockReq.body = {
        email: "test@example.com",
        name: "Test User",
      };
      const mockUser = new User({
        user_id: "uuid-123",
        email: "test@example.com",
        name: "Test User",
        created_at: new Date(),
        is_verified: false,
      });

      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue(mockUser);

      // Act
      await userController.createUser(mockReq, mockRes);

      // Assert
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(UserRepository.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User created successfully",
        user: mockUser,
      });
    });
  });
  describe("Create User - Error Handling", () => {
    test("should handle database errors in createUser", async () => {
      // Arrange
      mockReq.body = {
        email: "test@example.com",
        name: "Test User",
      };

      UserRepository.findByEmail = jest.fn().mockResolvedValue(null);
      UserRepository.create = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      console.error = jest.fn(); // Mock console.error

      // Act
      await userController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
      expect(console.error).toHaveBeenCalled();
    });

    test("should handle email already exists", async () => {
      // Arrange
      mockReq.body = {
        email: "test@example.com",
        name: "Test User",
      };

      const duplicateError = new Error("Duplicate key value");
      duplicateError.code = "23505";

      UserRepository.findByEmail = jest.fn().mockResolvedValue(null);
      UserRepository.create = jest.fn().mockRejectedValue(duplicateError);

      // Act
      await userController.createUser(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User with this email already exists",
      });
    });
  });
});
