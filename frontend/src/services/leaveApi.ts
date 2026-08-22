import { api } from '@/lib/api';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  dateRange: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
  submittedAt: string;
}

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

let mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv_101',
    employeeId: 'EMP1044',
    employeeName: 'Elena Rostova',
    department: 'Design',
    leaveType: 'Annual Leave',
    startDate: 'Aug 25, 2026',
    endDate: 'Aug 28, 2026',
    dateRange: 'Aug 25 - Aug 28 (4 days)',
    reason: 'Family vacation and personal downtime.',
    status: 'PENDING',
    submittedAt: '2 hours ago',
  },
  {
    id: 'lv_102',
    employeeId: 'EMP1047',
    employeeName: 'James Wilson',
    department: 'Finance',
    leaveType: 'Sick Leave',
    startDate: 'Aug 22, 2026',
    endDate: 'Aug 23, 2026',
    dateRange: 'Aug 22 - Aug 23 (2 days)',
    reason: 'Severe medical flu and doctor consultation.',
    status: 'PENDING',
    submittedAt: '5 hours ago',
  },
  {
    id: 'lv_103',
    employeeId: 'EMP1045',
    employeeName: 'David Chen',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: 'Aug 30, 2026',
    endDate: 'Aug 30, 2026',
    dateRange: 'Aug 30 (1 day)',
    reason: 'Home renovation inspection.',
    status: 'PENDING',
    submittedAt: 'Yesterday',
  },
];

export const leaveApi = {
  async getMyLeaves(): Promise<LeaveRequest[]> {
    if (USE_MOCK_API) {
      await delay(400);
      return mockLeaveRequests.filter((l) => l.employeeName === 'Alex Morgan');
    }
    const response = await api.get<LeaveRequest[]>('/leaves/my');
    return response.data;
  },

  async getAllLeaves(): Promise<LeaveRequest[]> {
    if (USE_MOCK_API) {
      await delay(500);
      return [...mockLeaveRequests];
    }
    const response = await api.get<LeaveRequest[]>('/leaves');
    return response.data;
  },

  async approveLeave(id: string): Promise<LeaveRequest> {
    if (USE_MOCK_API) {
      await delay(600);
      const target = mockLeaveRequests.find((l) => l.id === id);
      if (target) {
        target.status = 'APPROVED';
      }
      return { ...target! };
    }

    const response = await api.patch<LeaveRequest>(`/leaves/${id}/approve`);
    return response.data;
  },

  async rejectLeave(id: string, comment?: string): Promise<LeaveRequest> {
    if (USE_MOCK_API) {
      await delay(600);
      const target = mockLeaveRequests.find((l) => l.id === id);
      if (target) {
        target.status = 'REJECTED';
        target.adminComment = comment;
      }
      return { ...target! };
    }

    const response = await api.patch<LeaveRequest>(`/leaves/${id}/reject`, { comment });
    return response.data;
  },
};
