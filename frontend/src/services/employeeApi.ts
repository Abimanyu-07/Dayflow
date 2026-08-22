import { api } from '@/lib/api';

export interface EmployeeListItem {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  jobTitle: string;
  joiningDate?: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  employmentStatus?: 'Active' | 'On Leave' | 'Terminated';
  basicSalary?: number;
  avatarUrl?: string;
}

export interface EmployeeListResponse {
  data: EmployeeListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateEmployeePayload {
  employeeId?: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  jobTitle: string;
  joiningDate?: string;
  employmentStatus?: 'Active' | 'On Leave' | 'Terminated';
  basicSalary?: number;
}

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const mockEmployeesDatabase: EmployeeListItem[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP1042',
    fullName: 'Alex Morgan',
    email: 'employee@dayflow.hr',
    phone: '+91 98765 43210',
    department: 'Engineering',
    jobTitle: 'Senior Full Stack Engineer',
    joiningDate: '15 Jan 2024',
    attendanceStatus: 'PRESENT',
    employmentStatus: 'Active',
    basicSalary: 55000,
  },
  {
    id: 'emp_2',
    employeeId: 'EMP1043',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@dayflow.hr',
    phone: '+91 98111 22334',
    department: 'Product',
    jobTitle: 'Product Manager',
    joiningDate: '01 Mar 2024',
    attendanceStatus: 'PRESENT',
    employmentStatus: 'Active',
    basicSalary: 62000,
  },
  {
    id: 'emp_3',
    employeeId: 'EMP1044',
    fullName: 'Elena Rostova',
    email: 'elena.r@dayflow.hr',
    phone: '+91 98123 76543',
    department: 'Design',
    jobTitle: 'Lead UX Designer',
    joiningDate: '10 Aug 2023',
    attendanceStatus: 'LEAVE',
    employmentStatus: 'Active',
    basicSalary: 60000,
  },
  {
    id: 'emp_4',
    employeeId: 'EMP1045',
    fullName: 'David Chen',
    email: 'david.chen@dayflow.hr',
    phone: '+91 97788 55443',
    department: 'Engineering',
    jobTitle: 'DevOps Specialist',
    joiningDate: '12 May 2024',
    attendanceStatus: 'PRESENT',
    employmentStatus: 'Active',
    basicSalary: 58000,
  },
  {
    id: 'emp_5',
    employeeId: 'EMP1046',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@dayflow.hr',
    phone: '+91 96655 44332',
    department: 'Human Resources',
    jobTitle: 'HR Specialist',
    joiningDate: '01 Nov 2023',
    attendanceStatus: 'HALF_DAY',
    employmentStatus: 'Active',
    basicSalary: 48000,
  },
  {
    id: 'emp_6',
    employeeId: 'EMP1047',
    fullName: 'James Wilson',
    email: 'james.w@dayflow.hr',
    phone: '+91 95544 33221',
    department: 'Finance',
    jobTitle: 'Payroll Accountant',
    joiningDate: '20 Sep 2023',
    attendanceStatus: 'ABSENT',
    employmentStatus: 'Active',
    basicSalary: 52000,
  },
];

export const employeeApi = {
  async getEmployees(params?: {
    search?: string;
    department?: string;
    status?: string;
    sortBy?: string;
    page?: number;
  }): Promise<EmployeeListResponse> {
    if (USE_MOCK_API) {
      await delay(400);

      let filtered = [...mockEmployeesDatabase];

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.fullName.toLowerCase().includes(q) ||
            e.employeeId.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.jobTitle.toLowerCase().includes(q)
        );
      }

      if (params?.department && params.department !== 'ALL') {
        filtered = filtered.filter(
          (e) => e.department.toUpperCase() === params.department?.toUpperCase()
        );
      }

      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter(
          (e) => (e.employmentStatus || 'Active').toUpperCase() === params.status?.toUpperCase()
        );
      }

      if (params?.sortBy === 'name') {
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
      } else if (params?.sortBy === 'empId') {
        filtered.sort((a, b) => a.employeeId.localeCompare(b.employeeId));
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
      const found = mockEmployeesDatabase.find((e) => e.id === id || e.employeeId === id);
      return found || mockEmployeesDatabase[0];
    }

    const response = await api.get<EmployeeListItem>(`/employees/${id}`);
    return response.data;
  },

  async addEmployee(payload: CreateEmployeePayload): Promise<EmployeeListItem> {
    if (USE_MOCK_API) {
      await delay(600);
      const newEmpId = payload.employeeId || `EMP${1040 + mockEmployeesDatabase.length + 1}`;
      const newEmp: EmployeeListItem = {
        id: `emp_${Date.now()}`,
        employeeId: newEmpId,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || '+91 99999 00000',
        department: payload.department,
        jobTitle: payload.jobTitle,
        joiningDate: payload.joiningDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        attendanceStatus: 'PRESENT',
        employmentStatus: payload.employmentStatus || 'Active',
        basicSalary: payload.basicSalary || 50000,
      };

      mockEmployeesDatabase.unshift(newEmp);
      return newEmp;
    }

    const response = await api.post<EmployeeListItem>('/employees', payload);
    return response.data;
  },

  async updateEmployee(id: string, payload: Partial<CreateEmployeePayload>): Promise<EmployeeListItem> {
    if (USE_MOCK_API) {
      await delay(500);
      const target = mockEmployeesDatabase.find((e) => e.id === id || e.employeeId === id);
      if (target) {
        if (payload.fullName) target.fullName = payload.fullName;
        if (payload.email) target.email = payload.email;
        if (payload.phone) target.phone = payload.phone;
        if (payload.department) target.department = payload.department;
        if (payload.jobTitle) target.jobTitle = payload.jobTitle;
        if (payload.employmentStatus) target.employmentStatus = payload.employmentStatus;
        if (payload.basicSalary) target.basicSalary = payload.basicSalary;
      }
      return { ...target! };
    }

    const response = await api.put<EmployeeListItem>(`/employees/${id}`, payload);
    return response.data;
  },
};
