import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      ApiError.badRequest('Validation failed', errors.array().map((e) => ({ field: e.path, message: e.msg }))),
    );
  }
  next();
}

export default validate;
