import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { ApiResponse } from '../utils/apiResponse';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.unauthorized(res, 'Authentication token missing or invalid');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtUtil.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      ApiResponse.unauthorized(res, 'Authentication token expired');
      return;
    }
    ApiResponse.unauthorized(res, 'Invalid authentication token');
  }
};
