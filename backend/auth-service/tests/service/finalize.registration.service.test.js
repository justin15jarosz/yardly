import FinalizeRegistrationService from '../../src/services/finalize.registration.service.js';
import UserAuthRepository from '../../src/repository/user.auth.repository.js';
import { ExceptionFactory } from 'shared';
import { cacheManager } from '../../src/config/cache.manager.js';

jest.mock('../../src/repository/user.auth.repository.js');
jest.mock('../../src/config/cache.manager.js');

describe('FinalizeRegistrationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

  describe("finalizeRegistration", () => {
    const email = 'test@example.com';
    const otp = '654321';
    const password = 'securePassword';
    const cacheKey = `otp_registration_${email}`;

    it('should finalize registration with valid cached OTP', async () => {
      cacheManager.get.mockResolvedValue(otp);
      UserAuthRepository.createUserCredentials.mockResolvedValue();
      cacheManager.del.mockResolvedValue();

      await FinalizeRegistrationService.finalizeRegistration(email, otp, password);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserAuthRepository.createUserCredentials).toHaveBeenCalledWith(email, password);
      expect(cacheManager.del).toHaveBeenCalledWith(cacheKey);
      expect(ExceptionFactory.throwValidation).not.toHaveBeenCalled();
    });

    it('should throw validation error for invalid OTP', async () => {
      cacheManager.get.mockResolvedValue('wrong_otp');
      ExceptionFactory.throwValidation.mockRejectedValue(new Error('Invalid OTP'));

      await expect(
        FinalizeRegistrationService.finalizeRegistration(email, 'wrong_input', password)
      ).rejects.toThrow('Invalid OTP');

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserAuthRepository.createUserCredentials).not.toHaveBeenCalled();
      expect(cacheManager.del).not.toHaveBeenCalled();
      expect(ExceptionFactory.throwValidation).toHaveBeenCalledWith(
        'Invalid OTP', 'otp', 'wrong_input', { email }
      );
    });

    it('should throw validation error if createUserCredentials fails', async () => {
      cacheManager.get.mockResolvedValue(otp);
      UserAuthRepository.createUserCredentials.mockRejectedValue(new Error('DB error'));
      ExceptionFactory.throwValidation.mockRejectedValue(new Error('Error updating password'));

      await expect(
        FinalizeRegistrationService.finalizeRegistration(email, otp, password)
      ).rejects.toThrow('Error updating password');

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserAuthRepository.createUserCredentials).toHaveBeenCalledWith(email, password);
      expect(ExceptionFactory.throwValidation).toHaveBeenCalledWith(
        'Error updating password', 'password', password, { email }
      );
      expect(cacheManager.del).not.toHaveBeenCalled();
    });

    it('should throw error if cacheManager.get fails', async () => {
      const error = new Error('Redis down');
      cacheManager.get.mockRejectedValue(error);

      await expect(
        FinalizeRegistrationService.finalizeRegistration(email, otp, password)
      ).rejects.toThrow('Redis down');

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserAuthRepository.createUserCredentials).not.toHaveBeenCalled();
      expect(cacheManager.del).not.toHaveBeenCalled();
      expect(ExceptionFactory.throwValidation).not.toHaveBeenCalled();
    });
  });
});
