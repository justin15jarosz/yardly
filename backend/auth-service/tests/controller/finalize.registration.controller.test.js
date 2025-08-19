import { jest } from "@jest/globals";
import FinalizeRegistrationService from "../../src/services/finalize.registration.service.js";
import FinalizeRegistrationController from "../../src/controllers/registration.controller.js";

jest.mock("../../src/services/finalize.registration.service.js");
jest.mock("../../src/server.js", () => ({
  cacheManager: {
    get: jest.fn(),
  },
}));

describe("RegistrationController", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("finalizeRegistration", () => {
    it('should respond with 201 on successful registration', async () => {
      mockReq.body = {
        email: 'test@example.com',
        otp: '123456',
        password: 'securePassword'
      }
      FinalizeRegistrationService.finalizeRegistration.mockResolvedValue();

      await FinalizeRegistrationController.finalizeRegistration(mockReq, mockRes);

      expect(FinalizeRegistrationService.finalizeRegistration).toHaveBeenCalledWith(
        mockReq.body.email, mockReq.body.otp, mockReq.body.password
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registration finalized' });
    });

    it('should respond with error message and statusCode from error', async () => {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      FinalizeRegistrationService.finalizeRegistration.mockRejectedValue(error);

      await FinalizeRegistrationController.finalizeRegistration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid OTP' });
    });

    it('should handle errors without statusCode gracefully', async () => {
      const error = new Error('Unknown error');
      FinalizeRegistrationService.finalizeRegistration.mockRejectedValue(error);

      await FinalizeRegistrationController.finalizeRegistration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(undefined);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unknown error' });
    });
  });
});
