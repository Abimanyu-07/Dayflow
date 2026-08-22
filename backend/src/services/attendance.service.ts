import { AttendanceRecord, CheckInDTO, CheckOutDTO, AttendanceFilterDTO, WeeklyAttendanceSummary } from '../types/attendance.types';
import { AttendanceStatus } from '../config/constants';

// Mock in-memory attendance record store
export const attendanceStore: AttendanceRecord[] = [
  {
    id: 'att_1',
    employeeId: 'EMP-101',
    date: new Date().toISOString().split('T')[0],
    checkIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    checkOut: null,
    workingHours: 4,
    status: AttendanceStatus.PRESENT,
    notes: 'Morning shift',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class AttendanceService {
  static async checkIn(employeeId: string, dto: CheckInDTO): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0];

    // Check if attendance already recorded today
    const existing = attendanceStore.find((a) => a.employeeId === employeeId && a.date === today);
    if (existing && existing.checkIn) {
      throw new Error('You have already checked in today.');
    }

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId,
      date: today,
      checkIn: new Date().toISOString(),
      checkOut: null,
      workingHours: 0,
      status: AttendanceStatus.PRESENT,
      notes: dto.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    attendanceStore.unshift(newRecord);
    return newRecord;
  }

  static async checkOut(employeeId: string, dto: CheckOutDTO): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0];

    const record = attendanceStore.find((a) => a.employeeId === employeeId && a.date === today);
    if (!record || !record.checkIn) {
      throw new Error('No check-in record found for today. Please check in first.');
    }

    if (record.checkOut) {
      throw new Error('You have already checked out today.');
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(record.checkIn);
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const workingHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));

    let status = AttendanceStatus.PRESENT;
    if (workingHours < 4) {
      status = AttendanceStatus.ABSENT;
    } else if (workingHours < 7.5) {
      status = AttendanceStatus.HALF_DAY;
    }

    record.checkOut = checkOutTime.toISOString();
    record.workingHours = workingHours;
    record.status = status;
    if (dto.notes) {
      record.notes = record.notes ? `${record.notes} | ${dto.notes}` : dto.notes;
    }
    record.updatedAt = new Date().toISOString();

    return record;
  }

  static async getAttendanceList(filter: AttendanceFilterDTO): Promise<AttendanceRecord[]> {
    return attendanceStore.filter((record) => {
      if (filter.employeeId && record.employeeId !== filter.employeeId) return false;
      if (filter.status && record.status !== filter.status) return false;
      if (filter.startDate && record.date < filter.startDate) return false;
      if (filter.endDate && record.date > filter.endDate) return false;
      return true;
    });
  }

  static async getMyTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    const today = new Date().toISOString().split('T')[0];
    return attendanceStore.find((a) => a.employeeId === employeeId && a.date === today) || null;
  }

  static async getWeeklySummary(employeeId: string, weekStartDate?: string): Promise<WeeklyAttendanceSummary> {
    const start = weekStartDate ? new Date(weekStartDate) : new Date();
    const dayOfWeek = start.getDay(); // 0 is Sunday
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(start);
    monday.setDate(start.getDate() - distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startStr = monday.toISOString().split('T')[0];
    const endStr = sunday.toISOString().split('T')[0];

    const records = attendanceStore.filter(
      (a) => a.employeeId === employeeId && a.date >= startStr && a.date <= endStr
    );

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalHalfDay = 0;
    let totalLeave = 0;
    let totalHoursWorked = 0;

    records.forEach((r) => {
      if (r.status === AttendanceStatus.PRESENT) totalPresent++;
      else if (r.status === AttendanceStatus.ABSENT) totalAbsent++;
      else if (r.status === AttendanceStatus.HALF_DAY) totalHalfDay++;
      else if (r.status === AttendanceStatus.LEAVE) totalLeave++;

      totalHoursWorked += r.workingHours || 0;
    });

    return {
      weekStartDate: startStr,
      weekEndDate: endStr,
      totalPresent,
      totalAbsent,
      totalHalfDay,
      totalLeave,
      totalHoursWorked: parseFloat(totalHoursWorked.toFixed(2)),
      records,
    };
  }
}
