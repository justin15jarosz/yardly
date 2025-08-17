/**
 * Factory class for creating and throwing exceptions
 */
class ExceptionFactory {
    static async checkValidExcetionClass(ExceptionClass) {
        if (ExceptionClass && typeof ExceptionClass === 'function') {
            return;
        } else {
            throw new Error("Invalid exception class.");
        }
    }

    static async throw(ExceptionClass, ...args) {
        await ExceptionFactory.checkValidExcetionClass(ExceptionClass);
        throw new ExceptionClass(...args);
    }

    static async throwIf(condition, ExceptionClass, ...args) {
        await ExceptionFactory.checkValidExcetionClass(ExceptionClass);

        if (condition) {
            throw new ExceptionClass(...args);
        }
    }

    static async throwUnless(condition, ExceptionClass, ...args) {
        await ExceptionFactory.checkValidExcetionClass(ExceptionClass);

        if (!condition) {
            throw new ExceptionClass(...args);
        }
    }

    // Convenience methods for common exceptions
    static validation(message, field, value, additionalData) {
        throw new ValidationException(message, field, value, additionalData);
    }

    static notFound(resource, id, additionalData) {
        throw new NotFoundException(resource, id, additionalData);
    }

    static unauthorized(message, additionalData) {
        throw new UnauthorizedException(message, additionalData);
    }

    static forbidden(message, resource, additionalData) {
        throw new ForbiddenException(message, resource, additionalData);
    }

    static conflict(message, resource, additionalData) {
        throw new ConflictException(message, resource, additionalData);
    }

    static rateLimit(message, limit, additionalData) {
        throw new RateLimitException(message, limit, additionalData);
    }
}

export default ExceptionFactory;
