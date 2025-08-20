export { default as BaseException } from './exceptions/base.exception.js';
export { default as ExceptionFactory } from './exceptions/exception.factory.js';
export { ValidationException, NotFoundException, UnauthorizedException, ForbiddenException, ConflictException, RateLimitException } from './exceptions/specialized.exception.js';