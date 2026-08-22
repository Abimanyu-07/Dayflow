import { Response } from 'express';
import { HTTP_STATUS } from '../config/constants';

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string = 'Success',
    data: T | null = null,
    statusCode: number = HTTP_STATUS.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    message: string = 'Resource created successfully',
    data: T | null = null
  ) {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    error: any = null,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: typeof error === 'string' ? error : error?.message || error || null,
    });
  }

  static badRequest(res: Response, message: string = 'Bad Request', error: any = null) {
    return this.error(res, message, error, HTTP_STATUS.BAD_REQUEST);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized', error: any = null) {
    return this.error(res, message, error, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(res: Response, message: string = 'Forbidden - Insufficient permissions', error: any = null) {
    return this.error(res, message, error, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(res: Response, message: string = 'Resource not found', error: any = null) {
    return this.error(res, message, error, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(res: Response, message: string = 'Resource conflict', error: any = null) {
    return this.error(res, message, error, HTTP_STATUS.CONFLICT);
  }
}
