export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'HALF_DAY'
  | 'LEAVE'
  | 'NOT_CHECKED_IN';

export interface AttendanceRecord {
  id: string;
  userId?: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingDuration?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummaryStats {
  totalDays: number;
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  leaveCount: number;
  avgWorkingHours: string;
  attendanceRate: number;
}

export interface MarkAttendancePayload {
  recordId?: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  notes?: string;
}
