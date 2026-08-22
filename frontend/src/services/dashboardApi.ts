import { api } from '@/lib/api';
import { leaveApi } from './leaveApi';

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
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardApi = {
  async getEmployeeDashboard(): Promise<EmployeeDashboardData> {
    if (USE_MOCK_API) {
      await delay(500);
      return {
        attendanceStatus: 'NOT_CHECKED_IN',
        leaveBalance: 14,
        pendingRequestsCount: 1,
        workStatus: 'Not Started',
        recentActivities: [
          {
            id: 'act_1',
            title: 'Leave request submitted',
            description: 'Annual Leave request (Aug 25 - Aug 28)',
            timestamp: '2 hours ago',
            type: 'leave',
          },
          {
            id: 'act_2',
            title: 'Attendance marked Present',
            description: 'Checked in at 09:02 AM yesterday',
            timestamp: 'Yesterday',
            type: 'attendance',
          },
          {
            id: 'act_3',
            title: 'Profile info updated',
            description: 'Emergency contact information verified',
            timestamp: '3 days ago',
            type: 'profile',
          },
        ],
        profilePreview: {
          fullName: 'Alex Morgan',
          employeeId: 'EMP1042',
          jobTitle: 'Senior Full Stack Engineer',
          department: 'Engineering Department',
          email: 'alex.morgan@dayflow.hr',
        },
      };
    }

    const response = await api.get<EmployeeDashboardData>('/dashboard/employee');
    return response.data;
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    if (USE_MOCK_API) {
      await delay(400);
      const allLeaves = await leaveApi.getAllLeaves();
      const pendingCount = allLeaves.filter((l) => l.status === 'PENDING').length;

      return {
        totalEmployees: 42,
        presentToday: 34,
        onLeaveToday: 5,
        pendingLeaveRequests: pendingCount,
        attendanceDistribution: {
          present: 34,
          absent: 2,
          halfDay: 1,
          leave: 5,
        },
      };
    }

    const response = await api.get<AdminDashboardData>('/dashboard/admin');
    return response.data;
  },
};
