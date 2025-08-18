import UserService from '../../src/service/userService.js';
import UserRepository from '../../src/repository/userRepository.js';
import { publishMessage, TOPICS } from '../../src/config/kafka.js';
import { cacheManager } from '../../src/server.js';
import ExceptionFactory from '../../src/exception/exceptionFactory.js';
import { ConflictException } from '../../src/exception/specializedException.js';
import BaseException from '../../src/exception/baseException.js';

jest.mock('../../src/repository/userRepository.js');
jest.mock('../../src/config/kafka.js');
jest.mock('../../src/server.js');
jest.mock('../../src/exception/exceptionFactory.js');

describe('UserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        const email = 'test@example.com';
        const name = 'Test User';

        it('should create user and publish message successfully', async () => {
            const mockUser = { user_id: '123', email, name, toJSON: () => ({ user_id: '123', email, name }) };

            UserRepository.findByEmail.mockResolvedValue(null);
            ExceptionFactory.throwIf.mockResolvedValue(undefined);
            UserRepository.create.mockResolvedValue(mockUser);
            publishMessage.mockResolvedValue();

            await UserService.createUser(email, name);

            expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(ExceptionFactory.throwIf).toHaveBeenCalledWith(
                null,
                ConflictException,
                `User with this email already exists: ${email}`
            );
            expect(UserRepository.create).toHaveBeenCalledWith({ email, name });
            expect(publishMessage).toHaveBeenCalledWith(TOPICS.USER_REGISTRATIONS, expect.objectContaining({
                user_id: '123',
                email,
                name,
                purpose: 'registration',
                timestamp: expect.any(String),
                websiteUrl: expect.any(String),
            }));
        });

        it('should throw ConflictException if user exists', async () => {
            const existingUser = { user_id: '456', email, name };

            UserRepository.findByEmail.mockResolvedValue(existingUser);
            const conflictError = new ConflictException();
            ExceptionFactory.throwIf.mockImplementation(async () => {
                throw conflictError;
            });

            await expect(UserService.createUser(email, name)).rejects.toThrow(ConflictException);
            expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(ExceptionFactory.throwIf).toHaveBeenCalled();
        });

        it('should handle internal errors and throw InternalServerException', async () => {
            const internalError = new BaseException("Internal Service Error");
            UserRepository.findByEmail.mockResolvedValue(null);
            ExceptionFactory.throwIf.mockResolvedValue(undefined);
            UserRepository.create.mockRejectedValue(internalError);
            ExceptionFactory.throw.mockImplementation(async () => {
                throw internalError;
            });

            await expect(UserService.createUser(email, name)).rejects.toThrow(internalError);
            await expect(UserService.createUser(email, name)).rejects.toMatchObject({
                statusCode: 500,
                name: 'BaseException',
                message: 'Internal Service Error',
            });
            expect(ExceptionFactory.throw).toHaveBeenCalledWith(
                BaseException,
                'BaseException: Internal Service Error'
            );
        });
    });

  describe("finalizeRegistration", () => {
    const email = 'test@example.com';
    const otp = '654321';
    const password = 'securePassword';
    const cacheKey = `otp_registration_${email}`;

    it('should finalize registration with valid cached OTP', async () => {
      cacheManager.get.mockResolvedValue(otp);
      UserRepository.updatePassword.mockResolvedValue();
      cacheManager.del.mockResolvedValue();

      await UserService.finalizeRegistration(email, otp, password);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserRepository.updatePassword).toHaveBeenCalledWith(email, password);
      expect(cacheManager.del).toHaveBeenCalledWith(cacheKey);
      expect(ExceptionFactory.throwValidation).not.toHaveBeenCalled();
    });

    it('should throw validation error for invalid OTP', async () => {
      cacheManager.get.mockResolvedValue('wrong_otp');
      ExceptionFactory.throwValidation.mockRejectedValue(new Error('Invalid OTP'));

      await expect(
        UserService.finalizeRegistration(email, 'wrong_input', password)
      ).rejects.toThrow('Invalid OTP');

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserRepository.updatePassword).not.toHaveBeenCalled();
      expect(cacheManager.del).not.toHaveBeenCalled();
      expect(ExceptionFactory.throwValidation).toHaveBeenCalledWith(
        'Invalid OTP', 'otp', 'wrong_input', { email }
      );
    });

    it('should throw validation error if updatePassword fails', async () => {
      cacheManager.get.mockResolvedValue(otp);
      UserRepository.updatePassword.mockRejectedValue(new Error('DB error'));
      ExceptionFactory.throwValidation.mockRejectedValue(new Error('Error updating password'));

      await expect(
        UserService.finalizeRegistration(email, otp, password)
      ).rejects.toThrow('Error updating password');

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserRepository.updatePassword).toHaveBeenCalledWith(email, password);
      expect(ExceptionFactory.throwValidation).toHaveBeenCalledWith(
        'Error updating password', 'password', password, { email }
      );
      expect(cacheManager.del).not.toHaveBeenCalled();
    });

    it('should throw error if cacheManager.get fails', async () => {
      const error = new Error('Redis down');
      cacheManager.get.mockRejectedValue(error);

      await expect(
        UserService.finalizeRegistration(email, otp, password)
      ).rejects.toThrow('Redis down');

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(UserRepository.updatePassword).not.toHaveBeenCalled();
      expect(cacheManager.del).not.toHaveBeenCalled();
      expect(ExceptionFactory.throwValidation).not.toHaveBeenCalled();
    });
  });
});
