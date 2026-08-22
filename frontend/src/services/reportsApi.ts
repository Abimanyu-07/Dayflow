import { api } from '@/lib/api';
import {
  KpiMetrics,
  AttendanceTrendPoint,
  DepartmentPayrollPoint,
  LeaveDistributionPoint,
  EmployeeAttendanceReportItem,
} from '@/types/reports';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const mockKpiMetrics: KpiMetrics = {
  attendanceRate: 96.2,
  ontimeRate: 94.5,
  totalPayrollCost: 323500,
  approvedLeaveDays: 14,
  totalStaffCount: 42,
};

const mockAttendanceTrends: AttendanceTrendPoint[] = [
  { date: 'Aug 01', present: 38, absent: 2, halfDay: 1, leave: 1 },
  { date: 'Aug 05', present: 40, absent: 0, halfDay: 1, leave: 1 },
  { date: 'Aug 10', present: 36, absent: 3, halfDay: 1, leave: 2 },
  { date: 'Aug 15', present: 39, absent: 1, halfDay: 0, leave: 2 },
  { date: 'Aug 20', present: 37, absent: 2, halfDay: 2, leave: 1 },
  { date: 'Aug 22', present: 39, absent: 1, halfDay: 1, leave: 1 },
];

const mockDepartmentPayroll: DepartmentPayrollPoint[] = [
  {
    department: 'Engineering',
    employeeCount: 16,
    basicSalary: 115000,
    allowances: 25000,
    deductions: 9300,
    netPayroll: 130700,
  },
  {
    department: 'Product',
    employeeCount: 8,
    basicSalary: 62000,
    allowances: 14000,
    deductions: 5200,
    netPayroll: 70800,
  },
  {
    department: 'Design',
    employeeCount: 6,
    basicSalary: 60000,
    allowances: 15000,
    deductions: 5000,
    netPayroll: 70000,
  },
  {
    department: 'Human Resources',
    employeeCount: 6,
    basicSalary: 48000,
    allowances: 10000,
    deductions: 3800,
    netPayroll: 54200,
  },
  {
    department: 'Finance',
    employeeCount: 6,
    basicSalary: 52000,
    allowances: 11000,
    deductions: 4200,
    netPayroll: 58800,
  },
];

const mockLeaveDistribution: LeaveDistributionPoint[] = [
  { name: 'Annual Leave', value: 45, color: '#3b82f6' },
  { name: 'Sick Leave', value: 25, color: '#10b981' },
  { name: 'Casual Leave', value: 20, color: '#f59e0b' },
  { name: 'Unpaid Leave', value: 10, color: '#6b7280' },
];

const mockEmployeeAttendanceReport: EmployeeAttendanceReportItem[] = [
  {
    employeeId: 'EMP1042',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    presentDays: 20,
    absentDays: 0,
    halfDays: 1,
    leaveDays: 1,
    attendanceRate: 95,
  },
  {
    employeeId: 'EMP1043',
    employeeName: 'Marcus Vance',
    department: 'Product',
    presentDays: 21,
    absentDays: 0,
    halfDays: 0,
    leaveDays: 1,
    attendanceRate: 98,
  },
  {
    employeeId: 'EMP1044',
    employeeName: 'Elena Rostova',
    department: 'Design',
    presentDays: 18,
    absentDays: 1,
    halfDays: 1,
    leaveDays: 2,
    attendanceRate: 89,
  },
  {
    employeeId: 'EMP1045',
    employeeName: 'David Chen',
    department: 'Engineering',
    presentDays: 22,
    absentDays: 0,
    halfDays: 0,
    leaveDays: 0,
    attendanceRate: 100,
  },
  {
    employeeId: 'EMP1046',
    employeeName: 'Sophia Martinez',
    department: 'Human Resources',
    presentDays: 19,
    absentDays: 1,
    halfDays: 2,
    leaveDays: 0,
    attendanceRate: 92,
  },
  {
    employeeId: 'EMP1047',
    employeeName: 'James Wilson',
    department: 'Finance',
    presentDays: 17,
    absentDays: 2,
    halfDays: 1,
    leaveDays: 2,
    attendanceRate: 85,
  },
];

export const reportsApi = {
  async getReportsSummary(period = 'current-month'): Promise<{
    kpis: KpiMetrics;
    trends: AttendanceTrendPoint[];
    departmentPayroll: DepartmentPayrollPoint[];
    leaveDistribution: LeaveDistributionPoint[];
  }> {
    if (USE_MOCK_API) {
      await delay(400);
      return {
        kpis: mockKpiMetrics,
        trends: mockAttendanceTrends,
        departmentPayroll: mockDepartmentPayroll,
        leaveDistribution: mockLeaveDistribution,
      };
    }

    const response = await api.get('/reports/summary', { params: { period } });
    return response.data;
  },

  async getAttendanceReport(): Promise<EmployeeAttendanceReportItem[]> {
    if (USE_MOCK_API) {
      await delay(300);
      return mockEmployeeAttendanceReport;
    }
    const response = await api.get<EmployeeAttendanceReportItem[]>('/reports/attendance');
    return response.data;
  },
};
