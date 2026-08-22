export interface KpiMetrics {
  attendanceRate: number;
  ontimeRate: number;
  totalPayrollCost: number;
  approvedLeaveDays: number;
  totalStaffCount: number;
}

export interface AttendanceTrendPoint {
  date: string;
  present: number;
  absent: number;
  halfDay: number;
  leave: number;
}

export interface DepartmentPayrollPoint {
  department: string;
  employeeCount: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPayroll: number;
}

export interface LeaveDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface EmployeeAttendanceReportItem {
  employeeId: string;
  employeeName: string;
  department: string;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  attendanceRate: number;
}
