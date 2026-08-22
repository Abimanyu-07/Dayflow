import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ApiResponse } from '../utils/apiResponse';

export class DashboardController {
  static async getEmployeeDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeCode = req.user!.employeeId!;
      const todayStr = new Date().toLocaleDateString('en-CA');
      const todayDate = new Date(todayStr);

      const employee = await prisma.employees.findUnique({
        where: { employee_code: employeeCode },
        include: { users: true, departments: true },
      });

      if (!employee) {
        ApiResponse.notFound(res, 'Employee profile not found');
        return;
      }

      const todayAttendance = await prisma.attendance.findUnique({
        where: {
          employee_id_date: {
            employee_id: employee.id,
            date: todayDate,
          },
        },
      });

      let attendanceStatus: 'PRESENT' | 'NOT_CHECKED_IN' | 'COMPLETED' = 'NOT_CHECKED_IN';
      let workStatus: 'Working' | 'Not Started' | 'Completed' = 'Not Started';

      if (todayAttendance) {
        if (todayAttendance.check_out) {
          attendanceStatus = 'COMPLETED';
          workStatus = 'Completed';
        } else if (todayAttendance.check_in) {
          attendanceStatus = 'PRESENT';
          workStatus = 'Working';
        }
      }

      const pendingRequestsCount = await prisma.leaves.count({
        where: {
          employee_id: employee.id,
          status: 'PENDING',
        },
      });

      // Construct dynamic activities
      const recentLeaves = await prisma.leaves.findMany({
        where: { employee_id: employee.id },
        include: { leave_types: true },
        orderBy: { updated_at: 'desc' },
        take: 2,
      });

      const recentActivities: any[] = [];
      
      if (todayAttendance?.check_in) {
        recentActivities.push({
          id: `act_att_${todayAttendance.id}`,
          title: 'Attendance marked Present',
          description: `Checked in at ${todayAttendance.check_in.toLocaleTimeString()}`,
          timestamp: 'Today',
          type: 'attendance',
        });
      }

      recentLeaves.forEach((l) => {
        recentActivities.push({
          id: `act_leave_${l.id}`,
          title: `Leave request ${l.status.toLowerCase()}`,
          description: `${l.leave_types?.name} Leave request (${l.start_date.toISOString().split('T')[0]} to ${l.end_date.toISOString().split('T')[0]})`,
          timestamp: 'Recently',
          type: 'leave',
        });
      });

      if (recentActivities.length === 0) {
        recentActivities.push({
          id: 'act_default',
          title: 'Welcome to Dayflow',
          description: 'No recent activity recorded.',
          timestamp: 'Just now',
          type: 'system',
        });
      }

      const data = {
        attendanceStatus,
        leaveBalance: 14,
        pendingRequestsCount,
        workStatus,
        checkInTime: todayAttendance?.check_in ? todayAttendance.check_in.toISOString() : undefined,
        checkOutTime: todayAttendance?.check_out ? todayAttendance.check_out.toISOString() : undefined,
        workingTime: todayAttendance?.working_hours ? `${todayAttendance.working_hours} hrs` : undefined,
        recentActivities,
        profilePreview: {
          fullName: `${employee.first_name} ${employee.last_name || ''}`.trim(),
          employeeId: employee.employee_code,
          jobTitle: employee.designation || 'Employee',
          department: employee.departments?.name || 'Unassigned',
          email: employee.users?.email || '',
          avatarUrl: employee.profile_image || undefined,
        },
      };

      ApiResponse.success(res, 'Employee dashboard data retrieved', data);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAdminDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todayStr = new Date().toLocaleDateString('en-CA');
      const todayDate = new Date(todayStr);

      const totalEmployees = await prisma.employees.count();
      const presentToday = await prisma.attendance.count({
        where: { date: todayDate, status: 'PRESENT' },
      });
      const onLeaveToday = await prisma.attendance.count({
        where: { date: todayDate, status: 'LEAVE' },
      });
      const halfDayToday = await prisma.attendance.count({
        where: { date: todayDate, status: 'HALF_DAY' },
      });
      const absentToday = await prisma.attendance.count({
        where: { date: todayDate, status: 'ABSENT' },
      });

      const pendingLeaveRequests = await prisma.leaves.count({
        where: { status: 'PENDING' },
      });

      const data = {
        totalEmployees,
        presentToday: presentToday + halfDayToday,
        onLeaveToday,
        pendingLeaveRequests,
        attendanceDistribution: {
          present: presentToday,
          absent: absentToday,
          halfDay: halfDayToday,
          leave: onLeaveToday,
        },
      };

      ApiResponse.success(res, 'Admin dashboard data retrieved', data);
    } catch (error: any) {
      ApiResponse.badRequest(res, error.message);
    }
  }
}
