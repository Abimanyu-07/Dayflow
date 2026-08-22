import {
  AttendanceReportDTO,
  LeaveReportDTO,
  EmployeeReportDTO,
  PayrollReportDTO,
} from '../types/report.types';
import { AttendanceStatus, LeaveStatus, LeaveType } from '../config/constants';
import { prisma } from '../lib/prisma';

export class ReportService {
  static async getAttendanceReport(date?: string): Promise<AttendanceReportDTO> {
    const targetDate = date ? new Date(date) : new Date(new Date().toLocaleDateString('en-CA'));
    
    const totalEmployees = await prisma.employees.count();

    const dayRecords = await prisma.attendance.findMany({
      where: { date: targetDate },
    });

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
      date: targetDate.toISOString().split('T')[0],
    };
  }

  static async getLeaveReport(): Promise<LeaveReportDTO> {
    const leaves = await prisma.leaves.findMany({
      include: { leave_types: true },
    });

    let totalPending = 0;
    let totalApproved = 0;
    let totalRejected = 0;

    const leavesByType = {
      paid: 0,
      sick: 0,
      unpaid: 0,
    };

    leaves.forEach((l) => {
      if (l.status === LeaveStatus.PENDING) totalPending++;
      else if (l.status === LeaveStatus.APPROVED) totalApproved++;
      else if (l.status === LeaveStatus.REJECTED) totalRejected++;

      const typeName = l.leave_types?.name?.toLowerCase();
      if (typeName === 'paid') leavesByType.paid++;
      else if (typeName === 'sick') leavesByType.sick++;
      else if (typeName === 'unpaid') leavesByType.unpaid++;
    });

    return {
      totalPending,
      totalApproved,
      totalRejected,
      leavesByType,
    };
  }

  static async getEmployeeReport(): Promise<EmployeeReportDTO> {
    const employees = await prisma.employees.findMany({
      include: { users: true, departments: true },
    });

    const totalEmployees = employees.length;
    const activeEmployees = employees.length; // Default all active since it is dynamic

    const departmentDistribution: Record<string, number> = {};
    const roleDistribution: Record<string, number> = {};

    employees.forEach((e) => {
      const dept = e.departments?.name || 'Unassigned';
      departmentDistribution[dept] = (departmentDistribution[dept] || 0) + 1;

      const role = e.users?.role || 'EMPLOYEE';
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

    const monthlySlips = await prisma.payroll.findMany({
      where: { month: targetMonth, year: targetYear },
    });

    const totalMonthlyPayout = monthlySlips.reduce((sum, s) => sum + Number(s.net_salary), 0);
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
