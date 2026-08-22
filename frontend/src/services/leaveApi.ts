import { api } from '@/lib/api';
import {
  LeaveRequestItem,
  LeaveRequest,
  LeaveBalance,
  CreateLeavePayload,
} from '@/types/leave';

export type { LeaveRequestItem, LeaveRequest, LeaveBalance, CreateLeavePayload };

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let mockLeaveBalance: LeaveBalance = {
  annualRemaining: 12,
  annualTotal: 15,
  sickRemaining: 6,
  sickTotal: 8,
  casualRemaining: 4,
  casualTotal: 5,
  unpaidUsed: 0,
};

let mockLeaveRequests: LeaveRequestItem[] = [
  {
    id: 'lv_101',
    employeeId: 'EMP1044',
    employeeName: 'Elena Rostova',
    department: 'Design',
    leaveType: 'Annual Leave',
    startDate: 'Aug 25, 2026',
    endDate: 'Aug 28, 2026',
    dateRange: 'Aug 25 - Aug 28 (4 days)',
    durationDays: 4,
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
    durationDays: 2,
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
    durationDays: 1,
    reason: 'Home renovation inspection.',
    status: 'PENDING',
    submittedAt: 'Yesterday',
  },
  {
    id: 'lv_104',
    employeeId: 'EMP1042',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: 'Jul 10, 2026',
    endDate: 'Jul 12, 2026',
    dateRange: 'Jul 10 - Jul 12 (3 days)',
    durationDays: 3,
    reason: 'Annual family retreat.',
    status: 'APPROVED',
    submittedAt: 'Jul 01, 2026',
  },
];

export const leaveApi = {
  async getLeaveBalance(): Promise<LeaveBalance> {
    if (USE_MOCK_API) {
      await delay(300);
      return { ...mockLeaveBalance };
    }
    const response = await api.get<LeaveBalance>('/leaves/balance');
    return response.data;
  },

  async getMyLeaves(): Promise<LeaveRequestItem[]> {
    if (USE_MOCK_API) {
      await delay(400);
      return mockLeaveRequests.filter(
        (l) => l.employeeId === 'EMP1042' || l.employeeName === 'Alex Morgan'
      );
    }
    const response = await api.get<LeaveRequestItem[]>('/leaves/my');
    return response.data;
  },

  async applyLeave(payload: CreateLeavePayload): Promise<LeaveRequestItem> {
    if (USE_MOCK_API) {
      await delay(600);

      const start = new Date(payload.startDate);
      const end = new Date(payload.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const newLeave: LeaveRequestItem = {
        id: `lv_${Date.now()}`,
        employeeId: 'EMP1042',
        employeeName: 'Alex Morgan',
        department: 'Engineering',
        leaveType: payload.leaveType,
        startDate: payload.startDate,
        endDate: payload.endDate,
        dateRange: `${payload.startDate} - ${payload.endDate} (${durationDays} ${durationDays === 1 ? 'day' : 'days'})`,
        durationDays,
        reason: payload.reason,
        status: 'PENDING',
        submittedAt: 'Just now',
      };

      mockLeaveRequests.unshift(newLeave);

      // Deduct balance conditionally
      if (payload.leaveType === 'Annual Leave') mockLeaveBalance.annualRemaining -= durationDays;
      if (payload.leaveType === 'Sick Leave') mockLeaveBalance.sickRemaining -= durationDays;
      if (payload.leaveType === 'Casual Leave') mockLeaveBalance.casualRemaining -= durationDays;

      return newLeave;
    }

    const response = await api.post<LeaveRequestItem>('/leaves', payload);
    return response.data;
  },

  async getAllLeaves(params?: { status?: string; department?: string }): Promise<LeaveRequestItem[]> {
    if (USE_MOCK_API) {
      await delay(500);

      let filtered = [...mockLeaveRequests];

      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((l) => l.status === params.status);
      }

      if (params?.department && params.department !== 'ALL') {
        filtered = filtered.filter(
          (l) => l.department.toUpperCase() === params.department?.toUpperCase()
        );
      }

      return filtered;
    }

    const response = await api.get<LeaveRequestItem[]>('/leaves', { params });
    return response.data;
  },

  async approveLeave(id: string): Promise<LeaveRequestItem> {
    if (USE_MOCK_API) {
      await delay(600);
      const target = mockLeaveRequests.find((l) => l.id === id);
      if (target) {
        target.status = 'APPROVED';
      }
      return { ...target! };
    }

    const response = await api.patch<LeaveRequestItem>(`/leaves/${id}/approve`);
    return response.data;
  },

  async rejectLeave(id: string, comment?: string): Promise<LeaveRequestItem> {
    if (USE_MOCK_API) {
      await delay(600);
      const target = mockLeaveRequests.find((l) => l.id === id);
      if (target) {
        target.status = 'REJECTED';
        target.adminComment = comment;
      }
      return { ...target! };
    }

    const response = await api.patch<LeaveRequestItem>(`/leaves/${id}/reject`, { comment });
    return response.data;
  },
};
