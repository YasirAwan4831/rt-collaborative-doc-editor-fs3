import { ApiError } from '../utils/ApiError.js';
import config from '../config/index.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (config.env === 'development') {
    console.error('[Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    stack: config.env === 'development' ? err.stack : undefined,
  });
}

export default { notFoundHandler, errorHandler };
