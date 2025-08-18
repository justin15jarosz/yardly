import { ValidationException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    RateLimitException } from "../exception/specializedException.js";
/**
 * Factory class for creating and throwing exceptions
 */
class ExceptionFactory {
    static async checkValidExceptionClass(ExceptionClass) {
        if (ExceptionClass && typeof ExceptionClass === 'function') {
            return;
        } else {
            throw new Error("Invalid exception class.");
        }
    }

    static async throw(ExceptionClass, ...args) {
        await ExceptionFactory.checkValidExceptionClass(ExceptionClass);
        throw new ExceptionClass(...args);
    }

    static async throwIf(condition, ExceptionClass, ...args) {
        await ExceptionFactory.checkValidExceptionClass(ExceptionClass);

        if (condition) {
            throw new ExceptionClass(...args);
        }
    }

    static async throwUnless(condition, ExceptionClass, ...args) {
        await ExceptionFactory.checkValidExceptionClass(ExceptionClass);

        if (!condition) {
            throw new ExceptionClass(...args);
        }
    }

    // Convenience methods for common exceptions
    static async throwValidation(message, field, value, additionalData) {
        throw new ValidationException(message, field, value, additionalData);
    }

    static async throwNotFound(resource, id, additionalData) {
        throw new NotFoundException(resource, id, additionalData);
    }

    static async throwUnauthorized(message, additionalData) {
        throw new UnauthorizedException(message, additionalData);
    }

    static async throwForbidden(message, additionalData) {
        throw new ForbiddenException(message, additionalData);
    }

    static async throwConflict(message, additionalData) {
        throw new ConflictException(message, additionalData);
    }

    static async throwRateLimit(message, limit, additionalData) {
        throw new RateLimitException(message, limit, additionalData);
    }
}

export default ExceptionFactory;
