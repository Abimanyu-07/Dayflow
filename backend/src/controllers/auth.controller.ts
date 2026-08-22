import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.created(res, result.message, result.user);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ApiResponse.success(res, 'Login successful', result);
    } catch (error: any) {
      ApiResponse.unauthorized(res, error.message);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token);
      ApiResponse.success(res, 'Email verified successfully. You can now login.', result);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      ApiResponse.success(res, 'Token refreshed successfully', tokens);
    } catch (error: any) {
      ApiResponse.unauthorized(res, error.message);
    }
  }

  static async logout(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    // In stateless JWT, frontend discards tokens. Can be enhanced with redis blocklist if needed.
    ApiResponse.success(res, 'Logged out successfully');
  }
}
