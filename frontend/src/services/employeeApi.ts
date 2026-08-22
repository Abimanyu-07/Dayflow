import { api } from '@/lib/api';

export interface EmployeeListItem {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  jobTitle: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  avatarUrl?: string;
}

export interface EmployeeListResponse {
  data: EmployeeListItem[];
  total: number;
  page: number;
  totalPages: number;
}

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const mockEmployees: EmployeeListItem[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP1042',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@dayflow.hr',
    department: 'Engineering',
    jobTitle: 'Senior Full Stack Engineer',
    attendanceStatus: 'PRESENT',
  },
  {
    id: 'emp_2',
    employeeId: 'EMP1043',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@dayflow.hr',
    department: 'Product',
    jobTitle: 'Product Manager',
    attendanceStatus: 'PRESENT',
  },
  {
    id: 'emp_3',
    employeeId: 'EMP1044',
    fullName: 'Elena Rostova',
    email: 'elena.r@dayflow.hr',
    department: 'Design',
    jobTitle: 'Lead UX Designer',
    attendanceStatus: 'LEAVE',
  },
  {
    id: 'emp_4',
    employeeId: 'EMP1045',
    fullName: 'David Chen',
    email: 'david.chen@dayflow.hr',
    department: 'Engineering',
    jobTitle: 'DevOps Specialist',
    attendanceStatus: 'PRESENT',
  },
  {
    id: 'emp_5',
    employeeId: 'EMP1046',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@dayflow.hr',
    department: 'Human Resources',
    jobTitle: 'HR Specialist',
    attendanceStatus: 'HALF_DAY',
  },
  {
    id: 'emp_6',
    employeeId: 'EMP1047',
    fullName: 'James Wilson',
    email: 'james.w@dayflow.hr',
    department: 'Finance',
    jobTitle: 'Payroll Accountant',
    attendanceStatus: 'ABSENT',
  },
];

export const employeeApi = {
  async getEmployees(params?: { search?: string; department?: string; page?: number }): Promise<EmployeeListResponse> {
    if (USE_MOCK_API) {
      await delay(400);

      let filtered = [...mockEmployees];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.fullName.toLowerCase().includes(q) ||
            e.employeeId.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
      }

      if (params?.department && params.department !== 'ALL') {
        filtered = filtered.filter((e) => e.department.toUpperCase() === params.department?.toUpperCase());
      }

      return {
        data: filtered,
        total: filtered.length,
        page: params?.page || 1,
        totalPages: 1,
      };
    }

    const response = await api.get<EmployeeListResponse>('/employees', { params });
    return response.data;
  },

  async getEmployeeById(id: string): Promise<EmployeeListItem> {
    if (USE_MOCK_API) {
      await delay(300);
      const found = mockEmployees.find((e) => e.id === id || e.employeeId === id);
      return found || mockEmployees[0];
    }

    const response = await api.get<EmployeeListItem>(`/employees/${id}`);
    return response.data;
  },
};
