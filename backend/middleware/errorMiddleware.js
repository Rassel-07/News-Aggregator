/**
 * Global Error Handling Middleware
 */

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.code && typeof error.code === 'number' && error.code >= 400 && error.code < 600
    ? error.code
    : (res.statusCode && res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    message: error.message || 'An unexpected error occurred.',
    stack: process.env.NODE_ENV === 'production' ? null : error.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};