import { UserRole } from '../config/constants';

export interface EmployeeProfile {
  id: string;
  userId: string;
  employeeId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  employmentStatus?: string;
  salaryStructure?: SalaryStructureSummary;
  documents?: EmployeeDocumentSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSelfUpdateDTO {
  phone?: string;
  address?: string;
  profilePicture?: string;
}

export interface AdminEmployeeUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  department?: string;
  designation?: string;
  joiningDate?: string;
  employmentStatus?: string;
  baseSalary?: number;
  hra?: number;
  allowances?: number;
  deductions?: number;
}

export interface SalaryStructureSummary {
  id?: string;
  baseSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  effectiveDate: string;
}

export interface EmployeeDocumentSummary {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}
