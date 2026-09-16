import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      ...(config.isProduction ? {} : { stack: err.stack }),
    },
  });
}
