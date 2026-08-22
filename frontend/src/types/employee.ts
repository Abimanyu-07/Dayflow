export interface SalaryStructure {
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

export interface EmployeeDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  fileUrl?: string;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  jobTitle: string;
  joiningDate: string;
  employmentStatus: 'Active' | 'On Leave' | 'Terminated';
  reportingManager?: string;
  avatarUrl?: string;
  salary: SalaryStructure;
  documents: EmployeeDocument[];
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  jobTitle?: string;
  employmentStatus?: 'Active' | 'On Leave' | 'Terminated';
  reportingManager?: string;
  avatarUrl?: string;
  salary?: Partial<SalaryStructure>;
}
