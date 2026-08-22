import { LeaveRequestRecord, CreateLeaveDTO, ReviewLeaveDTO, LeaveFilterDTO } from '../types/leave.types';
import { LeaveStatus, LeaveType, AttendanceStatus } from '../config/constants';
import { NotificationService } from './notification.service';
import { employeesStore } from './employee.service';
import { usersStore } from './auth.service';
import { attendanceStore } from './attendance.service';

// Mock in-memory leave storage
export const leavesStore: LeaveRequestRecord[] = [
  {
    id: 'leave_1',
    employeeId: 'EMP-101',
    leaveType: LeaveType.PAID,
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    totalDays: 3,
    reason: 'Family function in hometown',
    status: LeaveStatus.PENDING,
    adminComment: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class LeaveService {
  static async applyLeave(employeeId: string, dto: CreateLeaveDTO): Promise<LeaveRequestRecord> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end < start) {
      throw new Error('Leave end date cannot be earlier than start date');
    }

    // Check for overlapping leaves for this employee
    const overlapping = leavesStore.find(
      (l) =>
        l.employeeId === employeeId &&
        l.status !== LeaveStatus.REJECTED &&
        ((dto.startDate >= l.startDate && dto.startDate <= l.endDate) ||
          (dto.endDate >= l.startDate && dto.endDate <= l.endDate) ||
          (dto.startDate <= l.startDate && dto.endDate >= l.endDate))
    );

    if (overlapping) {
      throw new Error(
        `Leave request overlaps with existing ${overlapping.status.toLowerCase()} leave (${overlapping.startDate} to ${overlapping.endDate})`
      );
    }

    // Calculate total days (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequestRecord = {
      id: `leave_${Date.now()}`,
      employeeId,
      leaveType: dto.leaveType,
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalDays,
      reason: dto.reason,
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leavesStore.unshift(newLeave);

    // Notify Admins
    const adminUser = usersStore.find((u) => u.role === 'ADMIN');
    if (adminUser) {
      await NotificationService.createNotification({
        userId: adminUser.id,
        type: 'LEAVE_SUBMITTED' as any,
        title: 'New Leave Application',
        message: `Employee ${employeeId} submitted a ${dto.leaveType} leave request for ${totalDays} day(s).`,
      });
    }

    return newLeave;
  }

  static async reviewLeave(
    leaveId: string,
    action: LeaveStatus.APPROVED | LeaveStatus.REJECTED,
    reviewerId: string,
    dto: ReviewLeaveDTO
  ): Promise<LeaveRequestRecord> {
    const leave = leavesStore.find((l) => l.id === leaveId);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new Error(`Cannot review leave request that is already ${leave.status.toLowerCase()}`);
    }

    leave.status = action;
    leave.adminComment = dto.adminComment || null;
    leave.reviewedBy = reviewerId;
    leave.reviewedAt = new Date().toISOString();
    leave.updatedAt = new Date().toISOString();

    // If approved, create/update attendance records for those dates with status LEAVE
    if (action === LeaveStatus.APPROVED) {
      const cur = new Date(leave.startDate);
      const stop = new Date(leave.endDate);
      while (cur <= stop) {
        const dateStr = cur.toISOString().split('T')[0];
        const existingAtt = attendanceStore.find(
          (a) => a.employeeId === leave.employeeId && a.date === dateStr
        );
        if (existingAtt) {
          existingAtt.status = AttendanceStatus.LEAVE;
          existingAtt.notes = `Leave: ${leave.leaveType}`;
        } else {
          attendanceStore.push({
            id: `att_leave_${Date.now()}_${dateStr}`,
            employeeId: leave.employeeId,
            date: dateStr,
            checkIn: new Date(cur.setHours(9, 0, 0)).toISOString(),
            checkOut: new Date(cur.setHours(18, 0, 0)).toISOString(),
            workingHours: 0,
            status: AttendanceStatus.LEAVE,
            notes: `Approved ${leave.leaveType} Leave`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        cur.setDate(cur.getDate() + 1);
      }
    }

    // Find employee user to send immediate notification & email
    const employee = employeesStore.find((e) => e.employeeId === leave.employeeId);
    if (employee) {
      await NotificationService.notifyLeaveStatusChange(
        employee.email,
        employee.userId,
        action,
        dto.adminComment
      );
    }

    return leave;
  }

  static async getLeaves(filter: LeaveFilterDTO): Promise<LeaveRequestRecord[]> {
    return leavesStore.filter((l) => {
      if (filter.employeeId && l.employeeId !== filter.employeeId) return false;
      if (filter.status && l.status !== filter.status) return false;
      if (filter.leaveType && l.leaveType !== filter.leaveType) return false;
      if (filter.startDate && l.startDate < filter.startDate) return false;
      if (filter.endDate && l.endDate > filter.endDate) return false;
      return true;
    });
  }
}
