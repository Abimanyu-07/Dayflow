import { z } from 'zod';
import { UserRole } from '../config/constants';

export const employeeSelfUpdateSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  profilePicture: z.string().url().optional(),
});

export const adminEmployeeUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
  employmentStatus: z.string().optional(),
  baseSalary: z.number().nonnegative().optional(),
  hra: z.number().nonnegative().optional(),
  allowances: z.number().nonnegative().optional(),
  deductions: z.number().nonnegative().optional(),
});
