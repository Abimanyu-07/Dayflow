import { LeaveRequestRecord, CreateLeaveDTO, ReviewLeaveDTO, LeaveFilterDTO } from '../types/leave.types';
import { LeaveStatus, LeaveType, AttendanceStatus } from '../config/constants';
import { NotificationService } from './notification.service';
import { prisma } from '../lib/prisma';

export class LeaveService {
  private static formatRecord(l: any): LeaveRequestRecord {
    return {
      id: l.id,
      employeeId: l.employees?.employee_code || '',
      leaveType: (l.leave_types?.name as LeaveType) || LeaveType.PAID,
      startDate: l.start_date.toISOString().split('T')[0],
      endDate: l.end_date.toISOString().split('T')[0],
      totalDays: Math.ceil(Math.abs(l.end_date.getTime() - l.start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      reason: l.reason || '',
      status: l.status as LeaveStatus,
      adminComment: l.admin_comment || null,
      reviewedBy: l.approved_by || null,
      reviewedAt: l.approved_at ? l.approved_at.toISOString() : null,
      createdAt: l.created_at ? l.created_at.toISOString() : new Date().toISOString(),
      updatedAt: l.updated_at ? l.updated_at.toISOString() : new Date().toISOString(),
    };
  }

  static async applyLeave(employeeCode: string, dto: CreateLeaveDTO): Promise<LeaveRequestRecord> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end < start) {
      throw new Error('Leave end date cannot be earlier than start date');
    }

    const employee = await prisma.employees.findUnique({
      where: { employee_code: employeeCode },
      include: { users: true },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Resolve or create leave type
    let leaveTypeRecord = await prisma.leave_types.findUnique({
      where: { name: dto.leaveType },
    });

    if (!leaveTypeRecord) {
      leaveTypeRecord = await prisma.leave_types.create({
        data: {
          name: dto.leaveType,
          description: `${dto.leaveType} leave type`,
          max_days: 15,
        },
      });
    }

    // Check for overlapping leaves for this employee
    const overlapping = await prisma.leaves.findFirst({
      where: {
        employee_id: employee.id,
        status: { not: LeaveStatus.REJECTED },
        OR: [
          {
            start_date: { lte: end },
            end_date: { gte: start },
          },
        ],
      },
    });

    if (overlapping) {
      const startStr = overlapping.start_date.toISOString().split('T')[0];
      const endStr = overlapping.end_date.toISOString().split('T')[0];
      throw new Error(
        `Leave request overlaps with existing ${overlapping.status.toLowerCase()} leave (${startStr} to ${endStr})`
      );
    }

    // Calculate total days (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = await prisma.leaves.create({
      data: {
        employee_id: employee.id,
        leave_type_id: leaveTypeRecord.id,
        start_date: start,
        end_date: end,
        reason: dto.reason,
        status: LeaveStatus.PENDING,
      },
      include: { employees: true, leave_types: true },
    });

    // Notify Admins
    try {
      const adminUsers = await prisma.users.findMany({
        where: { role: 'ADMIN' },
      });
      for (const admin of adminUsers) {
        await NotificationService.createNotification({
          userId: admin.id,
          type: 'LEAVE_SUBMITTED' as any,
          title: 'New Leave Application',
          message: `Employee ${employeeCode} submitted a ${dto.leaveType} leave request for ${totalDays} day(s).`,
        });
      }
    } catch (e) {
      console.warn('Failed to send leave notification to admins:', e);
    }

    return this.formatRecord(newLeave);
  }

  static async reviewLeave(
    leaveId: string,
    action: LeaveStatus.APPROVED | LeaveStatus.REJECTED,
    reviewerId: string,
    dto: ReviewLeaveDTO
  ): Promise<LeaveRequestRecord> {
    const leave = await prisma.leaves.findUnique({
      where: { id: leaveId },
      include: { employees: { include: { users: true } }, leave_types: true },
    });

    if (!leave) {
      throw new Error('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new Error(`Cannot review leave request that is already ${leave.status.toLowerCase()}`);
    }

    // Update the leave status in database
    const updatedLeave = await prisma.leaves.update({
      where: { id: leaveId },
      data: {
        status: action,
        approved_by: reviewerId,
        approved_at: new Date(),
      },
      include: { employees: { include: { users: true } }, leave_types: true },
    });

    // If approved, create/update attendance records for those dates with status LEAVE
    if (action === LeaveStatus.APPROVED) {
      const cur = new Date(leave.start_date);
      const stop = new Date(leave.end_date);
      while (cur <= stop) {
        const dateStr = cur.toISOString().split('T')[0];
        const dateObj = new Date(dateStr);

        const existingAtt = await prisma.attendance.findUnique({
          where: {
            employee_id_date: {
              employee_id: leave.employee_id,
              date: dateObj,
            },
          },
        });

        if (existingAtt) {
          await prisma.attendance.update({
            where: { id: existingAtt.id },
            data: {
              status: AttendanceStatus.LEAVE,
              notes: `Leave: ${leave.leave_types?.name}`,
            },
          });
        } else {
          const checkIn = new Date(cur);
          checkIn.setHours(9, 0, 0, 0);
          const checkOut = new Date(cur);
          checkOut.setHours(18, 0, 0, 0);

          await prisma.attendance.create({
            data: {
              employee_id: leave.employee_id,
              date: dateObj,
              check_in: checkIn,
              check_out: checkOut,
              working_hours: 0,
              status: AttendanceStatus.LEAVE,
              notes: `Approved ${leave.leave_types?.name} Leave`,
            },
          });
        }
        cur.setDate(cur.getDate() + 1);
      }
    }

    // Send notification & email
    const employee = leave.employees;
    if (employee && employee.users) {
      try {
        await NotificationService.notifyLeaveStatusChange(
          employee.users.email,
          employee.user_id,
          action,
          dto.adminComment
        );
      } catch (e) {
        console.warn('Failed to send status update notification:', e);
      }
    }

    return this.formatRecord(updatedLeave);
  }

  static async getLeaves(filter: LeaveFilterDTO): Promise<LeaveRequestRecord[]> {
    const whereClause: any = {};

    if (filter.employeeId) {
      const employee = await prisma.employees.findFirst({
        where: {
          OR: [
            { id: filter.employeeId },
            { employee_code: filter.employeeId },
          ],
        },
      });
      if (employee) {
        whereClause.employee_id = employee.id;
      }
    }

    if (filter.status) {
      whereClause.status = filter.status;
    }

    if (filter.leaveType) {
      whereClause.leave_types = { name: filter.leaveType };
    }

    if (filter.startDate || filter.endDate) {
      whereClause.OR = [
        {
          start_date: {
            gte: filter.startDate ? new Date(filter.startDate) : undefined,
            lte: filter.endDate ? new Date(filter.endDate) : undefined,
          },
        },
      ];
    }

    const leavesList = await prisma.leaves.findMany({
      where: whereClause,
      include: { employees: true, leave_types: true },
      orderBy: { start_date: 'desc' },
    });

    return leavesList.map(this.formatRecord);
  }
}
