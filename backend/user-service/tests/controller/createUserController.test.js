import { jest } from "@jest/globals";
import UserService from "../../src/service/userService.js";
import UserController from "../../src/controllers/userController.js";
import { ConflictException } from "../../src/exception/specializedException.js";

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
      const error = new ConflictException(`User with this email already exists: ${mockReq.body.email}`);
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
    it('should respond with 201 on successful registration', async () => {
      mockReq.body = {
        email: 'test@example.com',
        otp: '123456',
        password: 'securePassword'
      }
      UserService.finalizeRegistration.mockResolvedValue();

      await UserController.finalizeRegistration(mockReq, mockRes);

      expect(UserService.finalizeRegistration).toHaveBeenCalledWith(
        mockReq.body.email, mockReq.body.otp, mockReq.body.password
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registration finalized' });
    });

    it('should respond with error message and statusCode from error', async () => {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      UserService.finalizeRegistration.mockRejectedValue(error);

      await UserController.finalizeRegistration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid OTP' });
    });

    it('should handle errors without statusCode gracefully', async () => {
      const error = new Error('Unknown error');
      UserService.finalizeRegistration.mockRejectedValue(error);

      await UserController.finalizeRegistration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(undefined);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unknown error' });
    });
  });
});
