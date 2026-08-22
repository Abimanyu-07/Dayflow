import { api } from '@/lib/api';
import { AttendanceRecord, AttendanceSummaryStats, MarkAttendancePayload } from '@/types/attendance';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export function calculateWorkingDuration(
  checkInStr?: string,
  checkOutStr?: string,
  status?: string
): string {
  if (status === 'ABSENT' || status === 'LEAVE' || status === 'NOT_CHECKED_IN') {
    return '--';
  }

  if (!checkInStr) {
    return '--';
  }

  if (!checkOutStr) {
    return 'In progress';
  }

  const parseTimeToMinutes = (timeStr: string): number | null => {
    try {
      const cleaned = timeStr.trim().toUpperCase();
      const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
      if (!match) return null;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const modifier = match[3];

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    } catch {
      return null;
    }
  };

  const inMins = parseTimeToMinutes(checkInStr);
  const outMins = parseTimeToMinutes(checkOutStr);

  if (inMins === null || outMins === null) {
    return status === 'HALF_DAY' ? '4h 00m' : '8h 00m';
  }

  let diff = outMins - inMins;
  if (diff < 0) {
    diff += 24 * 60; // Overnight shift calculation
  }

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

const todayFormatted = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// Mock stateful today attendance
let todayAttendanceState: AttendanceRecord = {
  id: 'att_today_101',
  userId: 'usr_emp_01',
  employeeId: 'EMP1042',
  employeeName: 'Alex Morgan',
  department: 'Engineering',
  date: todayFormatted,
  status: 'NOT_CHECKED_IN',
};

// Mock stateful attendance records database
let mockAttendanceDatabase: AttendanceRecord[] = [
  todayAttendanceState,
  {
    id: 'att_102',
    employeeId: 'EMP1042',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    date: 'Aug 21, 2026',
    checkInTime: '09:02 AM',
    checkOutTime: '05:15 PM',
    workingDuration: '8h 13m',
    status: 'PRESENT',
  },
  {
    id: 'att_103',
    employeeId: 'EMP1042',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    date: 'Aug 20, 2026',
    checkInTime: '08:55 AM',
    checkOutTime: '05:00 PM',
    workingDuration: '8h 05m',
    status: 'PRESENT',
  },
  {
    id: 'att_104',
    employeeId: 'EMP1042',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    date: 'Aug 19, 2026',
    checkInTime: '09:15 AM',
    checkOutTime: '01:30 PM',
    workingDuration: '4h 15m',
    status: 'HALF_DAY',
    notes: 'Approved half-day for personal errand.',
  },
  {
    id: 'att_105',
    employeeId: 'EMP1043',
    employeeName: 'Marcus Vance',
    department: 'Product',
    date: todayFormatted,
    checkInTime: '08:45 AM',
    checkOutTime: '05:05 PM',
    workingDuration: '8h 20m',
    status: 'PRESENT',
  },
  {
    id: 'att_106',
    employeeId: 'EMP1044',
    employeeName: 'Elena Rostova',
    department: 'Design',
    date: todayFormatted,
    status: 'LEAVE',
    notes: 'Approved annual leave.',
  },
  {
    id: 'att_107',
    employeeId: 'EMP1045',
    employeeName: 'David Chen',
    department: 'Engineering',
    date: todayFormatted,
    checkInTime: '09:10 AM',
    workingDuration: 'In progress',
    status: 'PRESENT',
  },
  {
    id: 'att_108',
    employeeId: 'EMP1046',
    employeeName: 'Sophia Martinez',
    department: 'Human Resources',
    date: todayFormatted,
    checkInTime: '09:00 AM',
    checkOutTime: '01:00 PM',
    workingDuration: '4h 00m',
    status: 'HALF_DAY',
  },
  {
    id: 'att_109',
    employeeId: 'EMP1047',
    employeeName: 'James Wilson',
    department: 'Finance',
    date: todayFormatted,
    status: 'ABSENT',
    notes: 'Unexcused absence.',
  },
  {
    id: 'att_110',
    employeeId: 'EMP1048',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    date: todayFormatted,
    checkInTime: '09:00 AM',
    checkOutTime: '05:00 PM',
    workingDuration: '8h 00m',
    status: 'PRESENT',
  },
  {
    id: 'att_111',
    employeeId: 'EMP1049',
    employeeName: 'Rahul Verma',
    department: 'Product',
    date: todayFormatted,
    checkInTime: '09:15 AM',
    checkOutTime: '05:15 PM',
    workingDuration: '8h 00m',
    status: 'PRESENT',
  },
  {
    id: 'att_112',
    employeeId: 'EMP1050',
    employeeName: 'Ananya Das',
    department: 'Design',
    date: todayFormatted,
    checkInTime: '08:50 AM',
    checkOutTime: '05:00 PM',
    workingDuration: '8h 10m',
    status: 'PRESENT',
  },
  {
    id: 'att_113',
    employeeId: 'EMP1051',
    employeeName: 'Karan Patel',
    department: 'Finance',
    date: todayFormatted,
    checkInTime: '09:05 AM',
    checkOutTime: '05:05 PM',
    workingDuration: '8h 00m',
    status: 'PRESENT',
  },
];

export const attendanceApi = {
  async getTodayAttendance(): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(300);
      return { ...todayAttendanceState };
    }
    const response = await api.get<AttendanceRecord>('/attendance/today');
    return response.data;
  },

  async checkIn(): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(500);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      todayAttendanceState = {
        ...todayAttendanceState,
        status: 'PRESENT',
        checkInTime: timeStr,
        workingDuration: 'In progress',
      };

      const idx = mockAttendanceDatabase.findIndex((a) => a.id === todayAttendanceState.id);
      if (idx >= 0) mockAttendanceDatabase[idx] = todayAttendanceState;

      return { ...todayAttendanceState };
    }
    const response = await api.post<AttendanceRecord>('/attendance/check-in');
    return response.data;
  },

  async checkOut(): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(500);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const duration = calculateWorkingDuration(todayAttendanceState.checkInTime, timeStr, 'PRESENT');

      todayAttendanceState = {
        ...todayAttendanceState,
        checkOutTime: timeStr,
        workingDuration: duration,
      };

      const idx = mockAttendanceDatabase.findIndex((a) => a.id === todayAttendanceState.id);
      if (idx >= 0) mockAttendanceDatabase[idx] = todayAttendanceState;

      return { ...todayAttendanceState };
    }
    const response = await api.post<AttendanceRecord>('/attendance/check-out');
    return response.data;
  },

  async getMyAttendance(params?: { month?: string; status?: string }): Promise<{
    records: AttendanceRecord[];
    stats: AttendanceSummaryStats;
  }> {
    if (USE_MOCK_API) {
      await delay(400);

      let myRecords = mockAttendanceDatabase.filter(
        (a) => a.employeeId === 'EMP1042' || a.employeeName === 'Alex Morgan'
      );

      if (params?.status && params.status !== 'ALL') {
        myRecords = myRecords.filter((a) => a.status === params.status);
      }

      const presentCount = myRecords.filter((a) => a.status === 'PRESENT').length;
      const absentCount = myRecords.filter((a) => a.status === 'ABSENT').length;
      const halfDayCount = myRecords.filter((a) => a.status === 'HALF_DAY').length;
      const leaveCount = myRecords.filter((a) => a.status === 'LEAVE').length;

      return {
        records: myRecords,
        stats: {
          totalDays: myRecords.length,
          presentCount,
          absentCount,
          halfDayCount,
          leaveCount,
          avgWorkingHours: '7.8 hrs/day',
          attendanceRate: Math.round((presentCount / (myRecords.length || 1)) * 100),
        },
      };
    }

    const response = await api.get('/attendance/my', { params });
    return response.data;
  },

  async getAllAttendance(params?: {
    search?: string;
    department?: string;
    status?: string;
    date?: string;
  }): Promise<{
    records: AttendanceRecord[];
    stats: AttendanceSummaryStats;
  }> {
    if (USE_MOCK_API) {
      await delay(500);

      let filtered = [...mockAttendanceDatabase];

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.employeeName.toLowerCase().includes(q) ||
            a.employeeId.toLowerCase().includes(q) ||
            a.department.toLowerCase().includes(q)
        );
      }

      if (params?.department && params.department !== 'ALL') {
        filtered = filtered.filter(
          (a) => a.department.toUpperCase() === params.department?.toUpperCase()
        );
      }

      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((a) => a.status === params.status);
      }

      const presentCount = filtered.filter((a) => a.status === 'PRESENT').length;
      const absentCount = filtered.filter((a) => a.status === 'ABSENT').length;
      const halfDayCount = filtered.filter((a) => a.status === 'HALF_DAY').length;
      const leaveCount = filtered.filter((a) => a.status === 'LEAVE').length;

      return {
        records: filtered,
        stats: {
          totalDays: filtered.length,
          presentCount,
          absentCount,
          halfDayCount,
          leaveCount,
          avgWorkingHours: '8.1 hrs/day',
          attendanceRate: Math.round((presentCount / (filtered.length || 1)) * 100),
        },
      };
    }

    const response = await api.get('/attendance/all', { params });
    return response.data;
  },

  async markAttendance(payload: MarkAttendancePayload): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(600);

      let updatedRecord: AttendanceRecord;

      const computedDuration = calculateWorkingDuration(
        payload.checkInTime,
        payload.checkOutTime,
        payload.status
      );

      if (payload.recordId) {
        const idx = mockAttendanceDatabase.findIndex((a) => a.id === payload.recordId);
        if (idx >= 0) {
          mockAttendanceDatabase[idx] = {
            ...mockAttendanceDatabase[idx],
            checkInTime: payload.checkInTime !== undefined ? payload.checkInTime : mockAttendanceDatabase[idx].checkInTime,
            checkOutTime: payload.checkOutTime !== undefined ? payload.checkOutTime : mockAttendanceDatabase[idx].checkOutTime,
            status: payload.status,
            notes: payload.notes,
            workingDuration: computedDuration,
          };
          updatedRecord = mockAttendanceDatabase[idx];
        } else {
          updatedRecord = {
            id: payload.recordId,
            employeeId: payload.employeeId,
            employeeName: payload.employeeName || 'Employee',
            department: 'Engineering',
            date: payload.date || todayFormatted,
            checkInTime: payload.checkInTime,
            checkOutTime: payload.checkOutTime,
            status: payload.status,
            notes: payload.notes,
            workingDuration: computedDuration,
          };
          mockAttendanceDatabase.unshift(updatedRecord);
        }
      } else {
        updatedRecord = {
          id: `att_${Date.now()}`,
          employeeId: payload.employeeId,
          employeeName: payload.employeeName || 'Employee',
          department: 'Engineering',
          date: payload.date || todayFormatted,
          checkInTime: payload.checkInTime || '09:00 AM',
          checkOutTime: payload.checkOutTime || '05:00 PM',
          workingDuration: computedDuration,
          status: payload.status,
          notes: payload.notes,
        };
        mockAttendanceDatabase.unshift(updatedRecord);
      }

      return updatedRecord;
    }

    const response = await api.post<AttendanceRecord>('/attendance/mark', payload);
    return response.data;
  },
};
