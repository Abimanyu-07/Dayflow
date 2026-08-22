import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../config/constants';
import { ApiResponse } from '../utils/apiResponse';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.unauthorized(res, 'Authentication required');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ApiResponse.forbidden(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`
      );
      return;
    }

    next();
  };
};

export const requireAdminOrHR = authorizeRoles(UserRole.ADMIN, UserRole.HR);
export const requireAdmin = authorizeRoles(UserRole.ADMIN);
export const requireEmployee = authorizeRoles(UserRole.EMPLOYEE);
