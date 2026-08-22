import {
  AttendanceReportDTO,
  LeaveReportDTO,
  EmployeeReportDTO,
  PayrollReportDTO,
} from '../types/report.types';
import { employeesStore } from './employee.service';
import { attendanceStore } from './attendance.service';
import { leavesStore } from './leave.service';
import { salarySlipsStore } from './payroll.service';
import { AttendanceStatus, LeaveStatus, LeaveType } from '../config/constants';

export class ReportService {
  static async getAttendanceReport(date?: string): Promise<AttendanceReportDTO> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const totalEmployees = employeesStore.length;

    const dayRecords = attendanceStore.filter((a) => a.date === targetDate);

    let presentToday = 0;
    let absentToday = 0;
    let onLeaveToday = 0;
    let halfDayToday = 0;

    dayRecords.forEach((r) => {
      if (r.status === AttendanceStatus.PRESENT) presentToday++;
      else if (r.status === AttendanceStatus.ABSENT) absentToday++;
      else if (r.status === AttendanceStatus.LEAVE) onLeaveToday++;
      else if (r.status === AttendanceStatus.HALF_DAY) halfDayToday++;
    });

    const attendanceRatePercentage =
      totalEmployees > 0 ? parseFloat(((presentToday / totalEmployees) * 100).toFixed(1)) : 0;

    return {
      totalEmployees,
      presentToday,
      absentToday,
      onLeaveToday,
      halfDayToday,
      attendanceRatePercentage,
      date: targetDate,
    };
  }

  static async getLeaveReport(): Promise<LeaveReportDTO> {
    let totalPending = 0;
    let totalApproved = 0;
    let totalRejected = 0;

    const leavesByType = {
      paid: 0,
      sick: 0,
      unpaid: 0,
    };

    leavesStore.forEach((l) => {
      if (l.status === LeaveStatus.PENDING) totalPending++;
      else if (l.status === LeaveStatus.APPROVED) totalApproved++;
      else if (l.status === LeaveStatus.REJECTED) totalRejected++;

      if (l.leaveType === LeaveType.PAID) leavesByType.paid++;
      else if (l.leaveType === LeaveType.SICK) leavesByType.sick++;
      else if (l.leaveType === LeaveType.UNPAID) leavesByType.unpaid++;
    });

    return {
      totalPending,
      totalApproved,
      totalRejected,
      leavesByType,
    };
  }

  static async getEmployeeReport(): Promise<EmployeeReportDTO> {
    const totalEmployees = employeesStore.length;
    const activeEmployees = employeesStore.filter((e) => e.employmentStatus === 'Active').length;

    const departmentDistribution: Record<string, number> = {};
    const roleDistribution: Record<string, number> = {};

    employeesStore.forEach((e) => {
      const dept = e.department || 'Unassigned';
      departmentDistribution[dept] = (departmentDistribution[dept] || 0) + 1;

      const role = e.role;
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });

    return {
      totalEmployees,
      activeEmployees,
      departmentDistribution,
      roleDistribution,
    };
  }

  static async getPayrollReport(month?: number, year?: number): Promise<PayrollReportDTO> {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const monthlySlips = salarySlipsStore.filter(
      (s) => s.month === targetMonth && s.year === targetYear
    );

    const totalMonthlyPayout = monthlySlips.reduce((sum, s) => sum + s.netSalary, 0);
    const averageSalary =
      monthlySlips.length > 0 ? Math.round(totalMonthlyPayout / monthlySlips.length) : 0;

    return {
      totalMonthlyPayout,
      averageSalary,
      totalSalariesProcessed: monthlySlips.length,
      month: targetMonth,
      year: targetYear,
    };
  }
}
