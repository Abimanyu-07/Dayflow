import { AttendanceRecord, CheckInDTO, CheckOutDTO, AttendanceFilterDTO, WeeklyAttendanceSummary } from '../types/attendance.types';
import { AttendanceStatus } from '../config/constants';
import { prisma } from '../lib/prisma';

export class AttendanceService {
  private static formatRecord(att: any): AttendanceRecord {
    return {
      id: att.id,
      employeeId: att.employees?.employee_code || '',
      date: att.date.toISOString().split('T')[0],
      checkIn: att.check_in.toISOString(),
      checkOut: att.check_out ? att.check_out.toISOString() : null,
      workingHours: att.working_hours ? Number(att.working_hours) : 0,
      status: att.status as AttendanceStatus,
      notes: null, // Removed from database schema, return null for frontend compatibility
      createdAt: att.created_at.toISOString(),
      updatedAt: att.updated_at.toISOString(),
    };
  }

  static async checkIn(employeeCode: string, dto: CheckInDTO): Promise<AttendanceRecord> {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    const todayDate = new Date(todayStr);

    const employee = await prisma.employees.findUnique({
      where: { employee_code: employeeCode },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if attendance already recorded today
    const existing = await prisma.attendance.findUnique({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: todayDate,
        },
      },
    });

    if (existing && existing.check_in) {
      throw new Error('You have already checked in today.');
    }

    const newRecord = await prisma.attendance.create({
      data: {
        employee_id: employee.id,
        date: todayDate,
        check_in: new Date(),
        status: AttendanceStatus.PRESENT,
      },
      include: { employees: true },
    });

    return this.formatRecord(newRecord);
  }

  static async checkOut(employeeCode: string, dto: CheckOutDTO): Promise<AttendanceRecord> {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const todayDate = new Date(todayStr);

    const employee = await prisma.employees.findUnique({
      where: { employee_code: employeeCode },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const record = await prisma.attendance.findUnique({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: todayDate,
        },
      },
      include: { employees: true },
    });

    if (!record || !record.check_in) {
      throw new Error('No check-in record found for today. Please check in first.');
    }

    if (record.check_out) {
      throw new Error('You have already checked out today.');
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(record.check_in);
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const workingHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));

    let status = AttendanceStatus.PRESENT;
    if (workingHours < 4) {
      status = AttendanceStatus.ABSENT;
    } else if (workingHours < 7.5) {
      status = AttendanceStatus.HALF_DAY;
    }

    const updated = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        check_out: checkOutTime,
        working_hours: workingHours,
        status: status,
      },
      include: { employees: true },
    });

    return this.formatRecord(updated);
  }

  static async getAttendanceList(filter: AttendanceFilterDTO): Promise<AttendanceRecord[]> {
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

    if (filter.startDate || filter.endDate) {
      whereClause.date = {};
      if (filter.startDate) whereClause.date.gte = new Date(filter.startDate);
      if (filter.endDate) whereClause.date.lte = new Date(filter.endDate);
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: { employees: true },
      orderBy: { date: 'desc' },
    });

    return records.map(this.formatRecord);
  }

  static async getMyTodayAttendance(employeeCode: string): Promise<AttendanceRecord | null> {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const todayDate = new Date(todayStr);

    const employee = await prisma.employees.findUnique({
      where: { employee_code: employeeCode },
    });

    if (!employee) return null;

    const record = await prisma.attendance.findUnique({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: todayDate,
        },
      },
      include: { employees: true },
    });

    return record ? this.formatRecord(record) : null;
  }

  static async getWeeklySummary(employeeCode: string, weekStartDate?: string): Promise<WeeklyAttendanceSummary> {
    const employee = await prisma.employees.findUnique({
      where: { employee_code: employeeCode },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const start = weekStartDate ? new Date(weekStartDate) : new Date();
    const dayOfWeek = start.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(start);
    monday.setDate(start.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const records = await prisma.attendance.findMany({
      where: {
        employee_id: employee.id,
        date: {
          gte: monday,
          lte: sunday,
        },
      },
      include: { employees: true },
    });

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

      totalHoursWorked += r.working_hours ? Number(r.working_hours) : 0;
    });

    const formattedRecords = records.map(this.formatRecord);

    return {
      weekStartDate: monday.toISOString().split('T')[0],
      weekEndDate: sunday.toISOString().split('T')[0],
      totalPresent,
      totalAbsent,
      totalHalfDay,
      totalLeave,
      totalHoursWorked: parseFloat(totalHoursWorked.toFixed(2)),
      records: formattedRecords,
    };
  }
}
export const attendanceStore: any[] = [];
