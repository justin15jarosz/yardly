import UserService from '../../src/service/user.service.js';
import UserRepository from '../../src/repository/user.repository.js';
import { publishMessage, TOPICS } from '../../src/config/kafka.js';
import ExceptionFactory from '../../src/middlewares/exceptions/exception.factory.js';
import { ConflictException } from '../../src/middlewares/exceptions/specialized.exception.js';
import BaseException from '../../src/middlewares/exceptions/base.exception.js';

jest.mock('../../src/repository/user.repository.js');
jest.mock('../../src/config/kafka.js');
jest.mock('../../src/middlewares/exceptions/exception.factory.js');

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
});
