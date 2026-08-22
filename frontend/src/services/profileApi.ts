import { api } from '@/lib/api';
import { EmployeeProfile, UpdateProfilePayload, EmployeeDocument } from '@/types/employee';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('dayflow_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const profileApi = {
  async getMyProfile(): Promise<EmployeeProfile> {
    if (USE_MOCK_API) {
      await delay(300);
      const saved = getSavedUser();
      const name = saved?.fullName || (saved?.role === 'HR' ? 'Sarah Jenkins (HR Manager)' : 'Alex Morgan');
      const empId = saved?.employeeId || 'EMP1042';
      const email = saved?.email || 'employee@dayflow.com';

      return {
        id: saved?.id || 'usr_emp_01',
        employeeId: empId,
        fullName: name,
        email: email,
        phone: '+91 98765 43210',
        address: 'Bangalore, Karnataka, India',
        department: saved?.department || (saved?.role === 'HR' ? 'Human Resources' : 'Engineering'),
        jobTitle: saved?.designation || (saved?.role === 'HR' ? 'Head of People Operations' : 'Senior Software Engineer'),
        joiningDate: '15 Jan 2024',
        employmentStatus: 'Active',
        reportingManager: 'Sarah Jenkins (HR Manager)',
        salary: {
          basicSalary: 60000,
          allowances: 24000,
          deductions: 4000,
          netSalary: 80000,
        },
        documents: [],
      };
    }

    try {
      const response = await api.get<any>('/employees/me');
      const data = response.data?.data || response.data;
      
      const saved = getSavedUser();
      const fullName = data.fullName || (data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : null) || saved?.fullName || data.employeeId || 'Employee';

      return {
        id: data.id || data.userId || saved?.id,
        employeeId: data.employeeId || saved?.employeeId || 'EMP101',
        fullName,
        email: data.email || saved?.email,
        phone: data.phone || '+91 98765 43210',
        address: data.address || 'Bangalore, Karnataka, India',
        department: data.department || 'Engineering',
        jobTitle: data.jobTitle || data.designation || 'Software Engineer',
        joiningDate: data.joiningDate ? new Date(data.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '15 Jan 2024',
        employmentStatus: data.employmentStatus || 'Active',
        reportingManager: data.reportingManager || 'HR Manager',
        avatarUrl: data.profilePicture || data.avatarUrl || undefined,
        salary: {
          basicSalary: data.salaryStructure?.baseSalary || data.salary?.basicSalary || 60000,
          allowances: data.salaryStructure?.allowances || data.salary?.allowances || 24000,
          deductions: data.salaryStructure?.deductions || data.salary?.deductions || 4000,
          netSalary: data.salaryStructure?.netSalary || data.salary?.netSalary || 80000,
        },
        documents: (data.documents || []).map((d: any) => ({
          id: d.id,
          title: d.fileName || 'Document',
          fileName: d.fileName || 'document.pdf',
          fileType: d.fileType || 'PDF Document',
          fileSize: '1.2 MB',
          uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
          fileUrl: d.fileUrl,
        })),
      };
    } catch (e) {
      const saved = getSavedUser();
      return {
        id: saved?.id || 'usr_emp_01',
        employeeId: saved?.employeeId || 'EMP1042',
        fullName: saved?.fullName || saved?.employeeId || 'Employee User',
        email: saved?.email || 'employee@dayflow.com',
        phone: '+91 98765 43210',
        address: 'Bangalore, Karnataka, India',
        department: saved?.role === 'HR' ? 'Human Resources' : 'Engineering',
        jobTitle: saved?.role === 'HR' ? 'HR Manager' : 'Software Engineer',
        joiningDate: '15 Jan 2024',
        employmentStatus: 'Active',
        reportingManager: 'Sarah Jenkins (HR Manager)',
        salary: {
          basicSalary: 60000,
          allowances: 24000,
          deductions: 4000,
          netSalary: 80000,
        },
        documents: [],
      };
    }
  },

  async updateMyProfile(payload: UpdateProfilePayload): Promise<EmployeeProfile> {
    const response = await api.put<any>('/employees/me', payload);
    const data = response.data?.data || response.data;
    return data;
  },

  async getEmployeeProfile(id: string): Promise<EmployeeProfile> {
    const response = await api.get<any>(`/employees/${id}`);
    const data = response.data?.data || response.data;
    return data;
  },

  async updateEmployeeProfile(id: string, payload: UpdateProfilePayload): Promise<EmployeeProfile> {
    const response = await api.put<any>(`/employees/${id}`, payload);
    const data = response.data?.data || response.data;
    return data;
  },

  async uploadProfilePicture(id: string, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<any>(`/employees/${id}/profile-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },

  async uploadDocument(id: string, file: File, title: string): Promise<EmployeeDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    const response = await api.post<any>(`/employees/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },
};
