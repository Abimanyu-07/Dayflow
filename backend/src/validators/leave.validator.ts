import { z } from 'zod';
import { LeaveType, LeaveStatus } from '../config/constants';

export const createLeaveSchema = z
  .object({
    leaveType: z.nativeEnum(LeaveType),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
    reason: z.string().min(5, 'Reason must be at least 5 characters long').max(500),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  });

export const reviewLeaveSchema = z.object({
  adminComment: z.string().max(500).optional(),
});

export const leaveFilterSchema = z.object({
  status: z.nativeEnum(LeaveStatus).optional(),
  leaveType: z.nativeEnum(LeaveType).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
  employeeId: z.string().optional(),
});
