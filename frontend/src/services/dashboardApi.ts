import { api } from '@/lib/api';
import { leaveApi } from './leaveApi';
import { employeeApi } from './employeeApi';

export interface EmployeeDashboardData {
  attendanceStatus: 'PRESENT' | 'NOT_CHECKED_IN' | 'COMPLETED';
  leaveBalance: number;
  pendingRequestsCount: number;
  workStatus: 'Working' | 'Not Started' | 'Completed';
  checkInTime?: string;
  checkOutTime?: string;
  workingTime?: string;
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'attendance' | 'leave' | 'profile' | 'system';
  }>;
  profilePreview: {
    fullName: string;
    employeeId: string;
    jobTitle: string;
    department: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface AdminDashboardData {
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  attendanceDistribution: {
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
  };
}

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('dayflow_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const dashboardApi = {
  async getEmployeeDashboard(): Promise<EmployeeDashboardData> {
    const saved = getSavedUser();
    const displayName = saved?.fullName || (saved?.role === 'HR' ? 'Sarah Jenkins (HR Manager)' : 'Employee User');
    const displayEmpId = saved?.employeeId || 'EMP101';
    const displayEmail = saved?.email || 'employee@dayflow.com';

    if (USE_MOCK_API) {
      await delay(400);
      return {
        attendanceStatus: 'NOT_CHECKED_IN',
        leaveBalance: 14,
        pendingRequestsCount: 0,
        workStatus: 'Not Started',
        recentActivities: [
          {
            id: 'act_1',
            title: 'Welcome to Dayflow',
            description: 'Your workspace account is active',
            timestamp: 'Just now',
            type: 'system',
          },
        ],
        profilePreview: {
          fullName: displayName,
          employeeId: displayEmpId,
          jobTitle: saved?.designation || (saved?.role === 'HR' ? 'HR Manager' : 'Software Engineer'),
          department: saved?.department || (saved?.role === 'HR' ? 'Human Resources' : 'Engineering'),
          email: displayEmail,
        },
      };
    }

    try {
      const response = await api.get<any>('/dashboard/employee');
      const data = response.data?.data || response.data;
      return {
        attendanceStatus: data?.attendanceToday?.isCheckedIn ? 'PRESENT' : 'NOT_CHECKED_IN',
        leaveBalance: data?.leaveBalance?.paidLeave ?? 14,
        pendingRequestsCount: data?.pendingLeavesCount ?? 0,
        workStatus: data?.attendanceToday?.isCheckedIn ? 'Working' : 'Not Started',
        checkInTime: data?.attendanceToday?.checkInTime,
        checkOutTime: data?.attendanceToday?.checkOutTime,
        recentActivities: data?.recentActivities || [],
        profilePreview: {
          fullName: data?.user?.fullName || displayName,
          employeeId: data?.user?.employeeId || displayEmpId,
          jobTitle: data?.user?.designation || 'Software Engineer',
          department: data?.user?.department || 'Engineering',
          email: displayEmail,
          avatarUrl: data?.user?.avatarUrl,
        },
      };
    } catch {
      return {
        attendanceStatus: 'NOT_CHECKED_IN',
        leaveBalance: 14,
        pendingRequestsCount: 0,
        workStatus: 'Not Started',
        recentActivities: [],
        profilePreview: {
          fullName: displayName,
          employeeId: displayEmpId,
          jobTitle: saved?.designation || 'Software Engineer',
          department: saved?.department || 'Engineering',
          email: displayEmail,
        },
      };
    }
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    if (USE_MOCK_API) {
      await delay(400);
      const [allLeaves, empRes] = await Promise.all([
        leaveApi.getAllLeaves(),
        employeeApi.getEmployees(),
      ]);

      const pendingCount = allLeaves.filter((l) => l.status === 'PENDING').length;
      const totalStaff = empRes.data.length || 10;

      return {
        totalEmployees: totalStaff,
        presentToday: 7,
        onLeaveToday: 1,
        pendingLeaveRequests: pendingCount,
        attendanceDistribution: {
          present: 7,
          absent: 1,
          halfDay: 1,
          leave: 1,
        },
      };
    }

    const response = await api.get<any>('/dashboard/admin');
    const data = response.data?.data || response.data;
    return {
      totalEmployees: data?.totalEmployees ?? 5,
      presentToday: data?.presentToday ?? 0,
      onLeaveToday: data?.absentToday ?? 0,
      pendingLeaveRequests: data?.pendingLeavesCount ?? 0,
      attendanceDistribution: {
        present: data?.presentToday ?? 0,
        absent: data?.absentToday ?? 0,
        halfDay: 0,
        leave: 0,
      },
    };
  },
};
