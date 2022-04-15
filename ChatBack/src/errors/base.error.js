class BaseError extends Error {
    constructor(statusCode, errorKey, message, isOperational = true) {
        super();

        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.errorKey = errorKey;
        this.message = message;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

module.exports = BaseError;
