import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AuthUserPayload } from '../types/auth.types';

export class JwtUtil {
  static generateTokens(payload: AuthUserPayload) {
    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
      expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: ENV.JWT_EXPIRES_IN,
    };
  }

  static verifyAccessToken(token: string): AuthUserPayload {
    return jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
  }

  static verifyRefreshToken(token: string): AuthUserPayload {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as AuthUserPayload;
  }
}
