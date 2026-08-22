import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { HTTP_STATUS } from '../config/constants';
import { ENV } from '../config/env';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[UNHANDLED ERROR]', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  const errorDetails = ENV.NODE_ENV === 'development' ? err.stack : undefined;

  ApiResponse.error(res, message, errorDetails, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.notFound(res, `Route not found: ${req.method} ${req.originalUrl}`);
};
