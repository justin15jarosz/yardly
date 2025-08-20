import UserService from '../../src/service/user.service.js';
import UserRepository from '../../src/repository/user.repository.js';
import { publishMessage, TOPICS } from '../../src/config/kafka.js';
import { ExceptionFactory, ConflictException, BaseException} from 'shared';

// Mock dependencies
jest.mock("../../src/repository/user.repository.js");
jest.mock("../../src/config/kafka.js");
jest.mock("shared", () => ({
  ExceptionFactory: {
    throwIf: jest.fn(),
    throw: jest.fn()
  },
  ConflictException: class ConflictException extends Error {},
  BaseException: class BaseException extends Error {}
}));

describe("UserService.createUser", () => {
  const email = "test@example.com";
  const name = "John Doe";
  const user_id = "user-123";

  const mockUser = {
    user_id,
    email,
    name,
    toJSON: () => ({ user_id, email, name })
  };

  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should create a new user and publish a Kafka message", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);
    ExceptionFactory.throwIf.mockResolvedValue(undefined);
    UserRepository.create.mockResolvedValue(mockUser);
    publishMessage.mockResolvedValue();

    await UserService.createUser(email, name);

    expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(ExceptionFactory.throwIf).toHaveBeenCalledWith(null, ConflictException, expect.any(String));
    expect(UserRepository.create).toHaveBeenCalledWith({ email, name });
    expect(publishMessage).toHaveBeenCalledWith(
      TOPICS.USER_REGISTRATIONS,
      expect.objectContaining({
        user_id,
        email,
        name,
        purpose: "registration",
        timestamp: expect.any(String),
        websiteUrl: expect.any(String),
      })
    );
    expect(logSpy).toHaveBeenCalledWith(`📝 User registered: ${email}`);
  });

  it("should throw ConflictException if user already exists", async () => {
    const conflictError = new ConflictException("User already exists");

    UserRepository.findByEmail.mockResolvedValue({ email });
    ExceptionFactory.throwIf.mockImplementation(() => {
      throw conflictError;
    });

    await expect(UserService.createUser(email, name)).rejects.toThrow(ConflictException);

    expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(ExceptionFactory.throwIf).toHaveBeenCalledWith(expect.anything(), ConflictException, expect.any(String));
    expect(UserRepository.create).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should catch and rethrow internal errors as BaseException", async () => {
    const unexpectedError = new Error("Database down");

    UserRepository.findByEmail.mockRejectedValue(unexpectedError);
    ExceptionFactory.throw.mockImplementation(() => {
      throw new BaseException("wrapped error");
    });

    await expect(UserService.createUser(email, name)).rejects.toThrow(BaseException);

    expect(UserRepository.findByEmail).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("Internal Service Error:", unexpectedError);
    expect(ExceptionFactory.throw).toHaveBeenCalledWith(BaseException, expect.any(String));
  });
});