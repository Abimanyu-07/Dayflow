import { UserRole } from '../config/constants';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  employeeId?: string;
}

export interface RegisterDTO {
  employeeId: string;
  email: string;
  password: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  designation?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface VerifyEmailDTO {
  token: string;
}
