const AppError = require('../utils/AppError');
const { error: sendError } = require('../utils/apiResponse');

function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} was not found.`, 404, 'ROUTE_NOT_FOUND'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let code = err.code || 'INTERNAL_ERROR';

  // Mongoose invalid ObjectId -> treat as "not found" rather than leaking internals.
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'The requested resource could not be found.';
    code = 'NOT_FOUND';
  }

  // Mongoose validation errors.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' ');
    code = 'VALIDATION_ERROR';
  }

  // Duplicate key (e.g. email uniqueness) as a safety net beyond authService's own check.
  if (err.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists.';
    code = 'EMAIL_IN_USE';
  }

  if (!err.isOperational && process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('[unhandled error]', err);
  }

  if (statusCode >= 500) {
    message = 'Something went wrong. Please try again.';
  }

  return sendError(res, message, code, statusCode);
}

module.exports = { notFoundHandler, errorHandler };
