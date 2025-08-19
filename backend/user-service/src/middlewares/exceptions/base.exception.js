class BaseException extends Error {
  constructor(message, statusCode, errorCode, additionalData = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.errorCode = errorCode || 'INTERNAL_SERVER_ERROR';
    this.additionalData = additionalData;
  }
    

    /**
     * Convert exception to JSON format for API responses
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            timestamp: this.timestamp,
            additionalData: this.additionalData,
            ...(process.env.NODE_ENV !== 'production' && { stack: this.stack })
        };
    }

    /**
     * Get formatted error for logging
     */
    getLogFormat() {
        return {
            level: this.statusCode >= 500 ? 'error' : 'warn',
            message: this.message,
            errorCode: this.errorCode,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            stack: this.stack,
            additionalData: this.additionalData
        };
    }
}

export default BaseException;