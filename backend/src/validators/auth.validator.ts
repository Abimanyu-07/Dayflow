import { z } from 'zod';
import { UserRole } from '../config/constants';

export const registerSchema = z.object({
  employeeId: z.string().min(2, 'Employee ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.EMPLOYEE),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  termsAccepted: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
