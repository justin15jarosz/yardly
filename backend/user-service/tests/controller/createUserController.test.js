import { jest } from "@jest/globals";
import UserService from "../../src/service/userService.js";
import UserController from "../../src/controllers/userController.js";
import SpecializedException from "../../src/exception/specializedException.js";
import { cacheManager } from "../../src/server.js";

jest.mock("../../src/service/userService.js");
jest.mock("../../src/server.js", () => ({
  cacheManager: {
    get: jest.fn(),
  },
}));

describe("UserController", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("initializeRegistration", () => {
    it("should create user successfully", async () => {
      mockReq.body = { email: "test@example.com", name: "John" };
      const fakeUser = { id: 1, email: "test@example.com", name: "John" };
      UserService.createUser.mockResolvedValue(fakeUser);

      await UserController.intializeRegistration(mockReq, mockRes);

      expect(UserService.createUser).toHaveBeenCalledWith("test@example.com", "John");
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User created successfully",
        user: fakeUser,
      });
    });

    it("should handle email already registered", async () => {
      mockReq.body = { email: "fail@example.com", name: "Failing User" };
      const error = new SpecializedException.ConflictException(`User with this email already exists: ${mockReq.body.email}`);
      UserService.createUser.mockRejectedValue(error);

      await UserController.intializeRegistration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `User with this email already exists: ${mockReq.body.email}`
      });
    });

    it("should handle unexpected errors", async () => {
      const error = new Error("Something went wrong");
      UserService.createUser.mockRejectedValue(error);

      await UserController.intializeRegistration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("finalizeRegistration", () => {
    it("should finalize user registration successfully", async () => {
      const mockReq = {
        body: {
          email: "test@example.com",
          otp: "123456",
          password: "securePassword123",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock successful call
      UserService.finalizeRegistration = jest.fn().mockResolvedValue();

      await UserController.finalizeRegistration(mockReq, mockRes);

      expect(UserService.finalizeRegistration).toHaveBeenCalledWith(
        "test@example.com",
        "123456",
        "securePassword123"
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User registration finalized",
      });
    });

    it("should handle errors from UserService.finalizeRegistration", async () => {
      const mockReq = {
        body: {
          email: "test@example.com",
          otp: "wrongotp",
          password: "securePassword123",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error("Invalid OTP");
      UserService.finalizeRegistration = jest.fn().mockRejectedValue(error);

      await UserController.finalizeRegistration(mockReq, mockRes);

      expect(UserService.finalizeRegistration).toHaveBeenCalledWith(
        "test@example.com",
        "wrongotp",
        "securePassword123"
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
