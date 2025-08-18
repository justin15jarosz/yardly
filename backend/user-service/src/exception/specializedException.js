import BaseException from "./baseException.js";
/**
 * Validation Error - for input validation failures
 */
export class ValidationException extends BaseException {
    constructor(message, field = null, value = null, additionalData = {}) {
        super(message, 400, 'VALIDATION_ERROR', {
            field,
            value,
            ...additionalData
        });
    }
}

/**
 * Not Found Error - for resource not found scenarios
 */
export class NotFoundException extends BaseException {
    constructor(resource = 'Resource', id = null, additionalData = {}) {
        const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
        super(message, 404, 'NOT_FOUND', {
            resource,
            id,
            ...additionalData
        });
    }
}

/**
 * Unauthorized Error - for authentication failures
 */
export class UnauthorizedException extends BaseException {
    constructor(message = 'Authentication required', additionalData = {}) {
        super(message, 401, 'UNAUTHORIZED', additionalData);
    }
}

/**
 * Forbidden Error - for authorization failures
 */
export class ForbiddenException extends BaseException {
    constructor(message = 'Access forbidden', additionalData = {}) {
        super(message, 403, 'FORBIDDEN', {
            ...additionalData
        });
    }
}

/**
 * Conflict Error - for resource conflicts
 */
export class ConflictException extends BaseException {
    constructor(message = 'Resource conflict', additionalData = {}) {
        super(message, 409, 'CONFLICT', {
            ...additionalData
        });
    }
}

/**
 * Rate Limit Error - for rate limiting
 */
export class RateLimitException extends BaseException {
    constructor(message = 'Rate limit exceeded', limit = null, additionalData = {}) {
        super(message, 429, 'RATE_LIMIT_EXCEEDED', {
            limit,
            ...additionalData
        });
    }
}