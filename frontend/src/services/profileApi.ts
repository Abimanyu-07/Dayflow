import { api } from '@/lib/api';
import { EmployeeProfile, UpdateProfilePayload, EmployeeDocument } from '@/types/employee';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

<<<<<<< HEAD
const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('dayflow_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
=======
const getMockProfile = (id?: string): EmployeeProfile => {
  const key = id ?? 'usr_emp_01';
  const profile = mockProfilesRegistry.get(key) || mockProfilesRegistry.get('usr_emp_01');
  return profile ? { ...profile } : { ...mockProfilesRegistry.get('usr_emp_01')! };
};

// Mock stateful in-memory registry of employee profiles
const mockProfilesRegistry: Map<string, EmployeeProfile> = new Map([
  [
    'usr_emp_01',
    {
      id: 'usr_emp_01',
      employeeId: 'EMP1042',
      fullName: 'Alex Morgan',
      email: 'employee@dayflow.com',
      phone: '+91 98765 43210',
      address: 'Coimbatore, Tamil Nadu, India',
      department: 'Engineering',
      jobTitle: 'Senior Full Stack Engineer',
      joiningDate: '15 Jan 2024',
      employmentStatus: 'Active',
      reportingManager: 'Sarah Jenkins (HR Manager)',
      salary: {
        basicSalary: 55000,
        allowances: 12000,
        deductions: 4500,
        netSalary: 62500,
      },
      documents: [
        {
          id: 'doc_1',
          title: 'Resume / Curriculum Vitae',
          fileName: 'Alex_Morgan_CV.pdf',
          fileType: 'PDF Document',
          fileSize: '1.2 MB',
          uploadedAt: '15 Jan 2024',
        },
        {
          id: 'doc_2',
          title: 'Government ID Proof',
          fileName: 'Aadhaar_ID_Proof.pdf',
          fileType: 'PDF Document',
          fileSize: '850 KB',
          uploadedAt: '15 Jan 2024',
        },
      ],
    },
  ],
  [
    'EMP1044',
    {
      id: 'emp_3',
      employeeId: 'EMP1044',
      fullName: 'Elena Rostova',
      email: 'elena.r@dayflow.com',
      phone: '+91 98123 76543',
      address: 'Chennai, Tamil Nadu, India',
      department: 'Design',
      jobTitle: 'Lead UX Designer',
      joiningDate: '10 Aug 2023',
      employmentStatus: 'Active',
      reportingManager: 'Sarah Jenkins',
      salary: {
        basicSalary: 60000,
        allowances: 15000,
        deductions: 5000,
        netSalary: 70000,
      },
      documents: [
        {
          id: 'doc_3',
          title: 'Design Portfolio & Certificates',
          fileName: 'Elena_Portfolio_2026.pdf',
          fileType: 'PDF Document',
          fileSize: '3.4 MB',
          uploadedAt: '10 Aug 2023',
        },
      ],
    },
  ],
]);
>>>>>>> 9cfb56a (Connect backend to PostgreSQL database)

export const profileApi = {
  async getMyProfile(): Promise<EmployeeProfile> {
    if (USE_MOCK_API) {
<<<<<<< HEAD
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
=======
      await delay(400);
      return getMockProfile('usr_emp_01');
    }

    try {
      const response = await api.get<EmployeeProfile>('/employees/me');
      return response.data;
    } catch {
      return getMockProfile('usr_emp_01');
>>>>>>> 9cfb56a (Connect backend to PostgreSQL database)
    }
  },

  async updateMyProfile(payload: UpdateProfilePayload): Promise<EmployeeProfile> {
<<<<<<< HEAD
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
=======
    if (USE_MOCK_API) {
      await delay(600);
      const profile = mockProfilesRegistry.get('usr_emp_01');
      if (profile) {
        if (payload.phone !== undefined) profile.phone = payload.phone;
        if (payload.address !== undefined) profile.address = payload.address;
        if (payload.avatarUrl !== undefined) profile.avatarUrl = payload.avatarUrl;
        mockProfilesRegistry.set('usr_emp_01', profile);
      }
      return { ...profile! };
    }

    try {
      const response = await api.put<EmployeeProfile>('/employees/me', payload);
      return response.data;
    } catch {
      const profile = getMockProfile('usr_emp_01');
      if (payload.phone !== undefined) profile.phone = payload.phone;
      if (payload.address !== undefined) profile.address = payload.address;
      if (payload.avatarUrl !== undefined) profile.avatarUrl = payload.avatarUrl;
      mockProfilesRegistry.set('usr_emp_01', profile);
      return { ...profile };
    }
  },

  async getEmployeeProfile(id: string): Promise<EmployeeProfile> {
    if (USE_MOCK_API) {
      await delay(400);
      return getMockProfile(id);
    }

    try {
      const response = await api.get<EmployeeProfile>(`/employees/${id}`);
      return response.data;
    } catch {
      return getMockProfile(id);
    }
  },

  async updateEmployeeProfile(id: string, payload: UpdateProfilePayload): Promise<EmployeeProfile> {
    if (USE_MOCK_API) {
      await delay(600);
      let targetKey = 'usr_emp_01';
      if (mockProfilesRegistry.has(id)) targetKey = id;

      const profile = mockProfilesRegistry.get(targetKey);
      if (profile) {
        if (payload.fullName !== undefined) profile.fullName = payload.fullName;
        if (payload.email !== undefined) profile.email = payload.email;
        if (payload.phone !== undefined) profile.phone = payload.phone;
        if (payload.address !== undefined) profile.address = payload.address;
        if (payload.department !== undefined) profile.department = payload.department;
        if (payload.jobTitle !== undefined) profile.jobTitle = payload.jobTitle;
        if (payload.employmentStatus !== undefined) profile.employmentStatus = payload.employmentStatus;
        if (payload.avatarUrl !== undefined) profile.avatarUrl = payload.avatarUrl;

        if (payload.salary) {
          const basic = payload.salary.basicSalary ?? profile.salary.basicSalary;
          const allow = payload.salary.allowances ?? profile.salary.allowances;
          const ded = payload.salary.deductions ?? profile.salary.deductions;
          profile.salary = {
            basicSalary: basic,
            allowances: allow,
            deductions: ded,
            netSalary: basic + allow - ded,
          };
        }

        mockProfilesRegistry.set(targetKey, profile);
      }
      return { ...profile! };
    }

    try {
      const response = await api.put<EmployeeProfile>(`/employees/${id}`, payload);
      return response.data;
    } catch {
      const profile = getMockProfile(id);
      if (payload.fullName !== undefined) profile.fullName = payload.fullName;
      if (payload.email !== undefined) profile.email = payload.email;
      if (payload.phone !== undefined) profile.phone = payload.phone;
      if (payload.address !== undefined) profile.address = payload.address;
      if (payload.department !== undefined) profile.department = payload.department;
      if (payload.jobTitle !== undefined) profile.jobTitle = payload.jobTitle;
      if (payload.employmentStatus !== undefined) profile.employmentStatus = payload.employmentStatus;
      if (payload.avatarUrl !== undefined) profile.avatarUrl = payload.avatarUrl;
      if (payload.salary) {
        const basic = payload.salary.basicSalary ?? profile.salary.basicSalary;
        const allow = payload.salary.allowances ?? profile.salary.allowances;
        const ded = payload.salary.deductions ?? profile.salary.deductions;
        profile.salary = {
          basicSalary: basic,
          allowances: allow,
          deductions: ded,
          netSalary: basic + allow - ded,
        };
      }
      mockProfilesRegistry.set(id, profile);
      return { ...profile };
    }
  },

  async uploadProfilePicture(id: string, file: File): Promise<{ avatarUrl: string }> {
    if (USE_MOCK_API) {
      await delay(800);
      const mockAvatarUrl = URL.createObjectURL(file);
      
      const profile = mockProfilesRegistry.get(id) || mockProfilesRegistry.get('usr_emp_01');
      if (profile) {
        profile.avatarUrl = mockAvatarUrl;
      }
      return { avatarUrl: mockAvatarUrl };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<{ avatarUrl: string }>(`/employees/${id}/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      const mockAvatarUrl = URL.createObjectURL(file);
      const profile = mockProfilesRegistry.get(id) || mockProfilesRegistry.get('usr_emp_01');
      if (profile) {
        profile.avatarUrl = mockAvatarUrl;
        mockProfilesRegistry.set(id || 'usr_emp_01', profile);
      }
      return { avatarUrl: mockAvatarUrl };
    }
  },

  async uploadDocument(id: string, file: File, title: string): Promise<EmployeeDocument> {
    if (USE_MOCK_API) {
      await delay(700);
      const newDoc: EmployeeDocument = {
        id: `doc_${Date.now()}`,
        title: title || file.name,
        fileName: file.name,
        fileType: file.type.includes('pdf') ? 'PDF Document' : 'Document',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        fileUrl: URL.createObjectURL(file),
      };

      const profile = mockProfilesRegistry.get(id) || mockProfilesRegistry.get('usr_emp_01');
      if (profile) {
        profile.documents.unshift(newDoc);
      }
      return newDoc;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      const response = await api.post<EmployeeDocument>(`/employees/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      const newDoc: EmployeeDocument = {
        id: `doc_${Date.now()}`,
        title: title || file.name,
        fileName: file.name,
        fileType: file.type.includes('pdf') ? 'PDF Document' : 'Document',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        fileUrl: URL.createObjectURL(file),
      };

      const profile = mockProfilesRegistry.get(id) || mockProfilesRegistry.get('usr_emp_01');
      if (profile) {
        profile.documents.unshift(newDoc);
        mockProfilesRegistry.set(id || 'usr_emp_01', profile);
      }
      return newDoc;
    }
>>>>>>> 9cfb56a (Connect backend to PostgreSQL database)
  },
};
