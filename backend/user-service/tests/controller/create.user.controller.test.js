import { jest } from "@jest/globals";
import UserService from "../../src/service/user.service.js";
import UserController from "../../src/controllers/user.controller.js";
import { ConflictException } from "../../src/middlewares/exceptions/specialized.exception.js";

jest.mock("../../src/service/user.service.js");
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
});
