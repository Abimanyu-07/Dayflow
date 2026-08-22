import { AttendanceStatus } from '../config/constants';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // ISO Timestamp
  checkOut?: string | null; // ISO Timestamp
  workingHours?: number; // in hours
  status: AttendanceStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInDTO {
  notes?: string;
}

export interface CheckOutDTO {
  notes?: string;
}

export interface AttendanceFilterDTO {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  status?: AttendanceStatus;
}

export interface WeeklyAttendanceSummary {
  weekStartDate: string;
  weekEndDate: string;
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalLeave: number;
  totalHoursWorked: number;
  records: AttendanceRecord[];
}
