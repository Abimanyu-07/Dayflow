import { z } from 'zod';

export const updateSalaryStructureSchema = z.object({
  baseSalary: z.number().positive('Base salary must be greater than 0'),
  hra: z.number().nonnegative('HRA cannot be negative').default(0),
  allowances: z.number().nonnegative('Allowances cannot be negative').default(0),
  deductions: z.number().nonnegative('Deductions cannot be negative').default(0),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
});

export const generateSalarySlipSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2050),
});
