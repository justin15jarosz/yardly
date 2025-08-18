import UserService from '../../src/service/userService.js';
import UserRepository from '../../src/repository/userRepository.js';
import { publishMessage, TOPICS } from '../../src/config/kafka.js';
import { cacheManager } from '../../src/server.js';
import ExceptionFactory from '../../src/exception/exceptionFactory.js';
import SpecializedException from '../../src/exception/specializedException.js';
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
                SpecializedException.ConflictException,
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
            const conflictError = new SpecializedException.ConflictException();
            ExceptionFactory.throwIf.mockImplementation(async () => {
                throw conflictError;
            });

            await expect(UserService.createUser(email, name)).rejects.toThrow(SpecializedException.ConflictException);
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

    describe('finalizeRegistration', () => {
        it('should retrieve OTP from cache', async () => {
            const email = 'test@example.com';
            const otp = '123456';
            const password = 'password123';

            const mockValue = 'stored_otp';

            cacheManager.get.mockResolvedValue(mockValue);

            const service = new UserService();

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await service.finalizeRegistration(email, otp, password);

            expect(cacheManager.get).toHaveBeenCalledWith(`otp_registration_${email}`);
            expect(consoleSpy).toHaveBeenCalledWith('Retrieved from cache:', mockValue);

            consoleSpy.mockRestore();
        });
    });
});
