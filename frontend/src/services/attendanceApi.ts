import { api } from '@/lib/api';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'NOT_CHECKED_IN';
  workingDuration?: string;
}

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock attendance state in memory
let todayAttendanceState: AttendanceRecord = {
  id: 'att_today_101',
  userId: 'usr_emp_01',
  date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  status: 'NOT_CHECKED_IN',
};

export const attendanceApi = {
  async getTodayAttendance(): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(400);
      return { ...todayAttendanceState };
    }
    const response = await api.get<AttendanceRecord>('/attendance/today');
    return response.data;
  },

  async checkIn(): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(600);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      todayAttendanceState = {
        ...todayAttendanceState,
        status: 'PRESENT',
        checkInTime: timeStr,
      };
      return { ...todayAttendanceState };
    }
    const response = await api.post<AttendanceRecord>('/attendance/check-in');
    return response.data;
  },

  async checkOut(): Promise<AttendanceRecord> {
    if (USE_MOCK_API) {
      await delay(600);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      todayAttendanceState = {
        ...todayAttendanceState,
        checkOutTime: timeStr,
        workingDuration: '7h 45m',
      };
      return { ...todayAttendanceState };
    }
    const response = await api.post<AttendanceRecord>('/attendance/check-out');
    return response.data;
  },

  async getMyAttendance(): Promise<AttendanceRecord[]> {
    if (USE_MOCK_API) {
      await delay(400);
      return [
        todayAttendanceState,
        {
          id: 'att_prev_1',
          userId: 'usr_emp_01',
          date: 'Yesterday',
          checkInTime: '09:02 AM',
          checkOutTime: '05:15 PM',
          status: 'PRESENT',
          workingDuration: '8h 13m',
        },
        {
          id: 'att_prev_2',
          userId: 'usr_emp_01',
          date: 'Aug 20, 2026',
          checkInTime: '08:55 AM',
          checkOutTime: '05:00 PM',
          status: 'PRESENT',
          workingDuration: '8h 05m',
        },
      ];
    }
    const response = await api.get<AttendanceRecord[]>('/attendance/my');
    return response.data;
  },

  async getAllAttendance(): Promise<AttendanceRecord[]> {
    if (USE_MOCK_API) {
      await delay(500);
      return [];
    }
    const response = await api.get<AttendanceRecord[]>('/attendance/all');
    return response.data;
  },
};
