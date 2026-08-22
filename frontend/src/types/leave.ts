export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Unpaid Leave';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveBalance {
  annualRemaining: number;
  annualTotal: number;
  sickRemaining: number;
  sickTotal: number;
  casualRemaining: number;
  casualTotal: number;
  unpaidUsed: number;
}

export interface LeaveRequestItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  dateRange: string;
  durationDays: number;
  reason: string;
  status: LeaveStatus;
  adminComment?: string;
  submittedAt: string;
}

export type LeaveRequest = LeaveRequestItem;

export interface CreateLeavePayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}
