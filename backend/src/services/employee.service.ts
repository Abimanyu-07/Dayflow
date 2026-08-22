import {
  EmployeeProfile,
  EmployeeSelfUpdateDTO,
  AdminEmployeeUpdateDTO,
  EmployeeDocumentSummary,
} from '../types/employee.types';
import { UserRole } from '../config/constants';
import { usersStore } from './auth.service';

// Mock in-memory employee profile storage
export const employeesStore: EmployeeProfile[] = [
  {
    id: 'emp_prof_1',
    userId: 'user_admin_1',
    employeeId: 'ADM-001',
    email: 'admin@dayflow.com',
    role: UserRole.ADMIN,
    firstName: 'System',
    lastName: 'Admin',
    phone: '+91 9876543210',
    address: '100 Feet Rd, Indiranagar, Bangalore',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Human Resources',
    designation: 'Head of People Operations',
    joiningDate: '2023-01-01',
    employmentStatus: 'Active',
    salaryStructure: {
      baseSalary: 120000,
      hra: 48000,
      allowances: 20000,
      deductions: 10000,
      netSalary: 178000,
      effectiveDate: '2023-01-01',
    },
    documents: [
      {
        id: 'doc_1',
        fileName: 'Offer_Letter_Admin.pdf',
        fileType: 'application/pdf',
        fileUrl: '/uploads/documents/doc_1.pdf',
        uploadedAt: '2023-01-01T10:00:00.000Z',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'emp_prof_2',
    userId: 'user_emp_1',
    employeeId: 'EMP-101',
    email: 'employee@dayflow.com',
    role: UserRole.EMPLOYEE,
    firstName: 'Rahul',
    lastName: 'Sharma',
    phone: '+91 9123456780',
    address: 'Koramangala 4th Block, Bangalore',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2023-06-15',
    employmentStatus: 'Active',
    salaryStructure: {
      baseSalary: 80000,
      hra: 32000,
      allowances: 15000,
      deductions: 7000,
      netSalary: 120000,
      effectiveDate: '2023-06-15',
    },
    documents: [
      {
        id: 'doc_2',
        fileName: 'Resume_Rahul_Sharma.pdf',
        fileType: 'application/pdf',
        fileUrl: '/uploads/documents/doc_2.pdf',
        uploadedAt: '2023-06-15T10:00:00.000Z',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class EmployeeService {
  static async getAllEmployees(query?: { department?: string; search?: string }): Promise<EmployeeProfile[]> {
    let list = [...employeesStore];
    if (query?.department) {
      list = list.filter((e) => e.department?.toLowerCase() === query.department?.toLowerCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q)
      );
    }
    return list;
  }

  static async getEmployeeById(idOrEmployeeId: string): Promise<EmployeeProfile> {
    const employee = employeesStore.find(
      (e) => e.id === idOrEmployeeId || e.employeeId.toUpperCase() === idOrEmployeeId.toUpperCase() || e.userId === idOrEmployeeId
    );
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  }

  static async getMyProfile(userId: string): Promise<EmployeeProfile> {
    const employee = employeesStore.find((e) => e.userId === userId);
    if (!employee) {
      throw new Error('Employee profile not found for this user');
    }
    return employee;
  }

  static async updateSelfProfile(userId: string, dto: EmployeeSelfUpdateDTO): Promise<EmployeeProfile> {
    const employee = employeesStore.find((e) => e.userId === userId);
    if (!employee) {
      throw new Error('Employee profile not found');
    }

    if (dto.phone !== undefined) employee.phone = dto.phone;
    if (dto.address !== undefined) employee.address = dto.address;
    if (dto.profilePicture !== undefined) employee.profilePicture = dto.profilePicture;

    employee.updatedAt = new Date().toISOString();
    return employee;
  }

  static async updateEmployeeByAdmin(idOrEmployeeId: string, dto: AdminEmployeeUpdateDTO): Promise<EmployeeProfile> {
    const employee = employeesStore.find(
      (e) => e.id === idOrEmployeeId || e.employeeId.toUpperCase() === idOrEmployeeId.toUpperCase()
    );
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (dto.firstName) employee.firstName = dto.firstName;
    if (dto.lastName) employee.lastName = dto.lastName;
    if (dto.email) {
      employee.email = dto.email;
      const user = usersStore.find((u) => u.id === employee.userId);
      if (user) user.email = dto.email;
    }
    if (dto.phone !== undefined) employee.phone = dto.phone;
    if (dto.address !== undefined) employee.address = dto.address;
    if (dto.role) {
      employee.role = dto.role;
      const user = usersStore.find((u) => u.id === employee.userId);
      if (user) user.role = dto.role;
    }
    if (dto.department) employee.department = dto.department;
    if (dto.designation) employee.designation = dto.designation;
    if (dto.joiningDate) employee.joiningDate = dto.joiningDate;
    if (dto.employmentStatus) employee.employmentStatus = dto.employmentStatus;

    if (dto.baseSalary !== undefined) {
      const base = dto.baseSalary;
      const hra = dto.hra ?? employee.salaryStructure?.hra ?? 0;
      const allowances = dto.allowances ?? employee.salaryStructure?.allowances ?? 0;
      const deductions = dto.deductions ?? employee.salaryStructure?.deductions ?? 0;
      const netSalary = base + hra + allowances - deductions;

      employee.salaryStructure = {
        baseSalary: base,
        hra,
        allowances,
        deductions,
        netSalary,
        effectiveDate: new Date().toISOString().split('T')[0],
      };
    }

    employee.updatedAt = new Date().toISOString();
    return employee;
  }

  static async addDocument(
    employeeId: string,
    fileInfo: { fileName: string; fileType: string; fileUrl: string }
  ): Promise<EmployeeDocumentSummary> {
    const employee = employeesStore.find(
      (e) => e.id === employeeId || e.employeeId.toUpperCase() === employeeId.toUpperCase()
    );
    if (!employee) {
      throw new Error('Employee not found');
    }

    const doc: EmployeeDocumentSummary = {
      id: `doc_${Date.now()}`,
      fileName: fileInfo.fileName,
      fileType: fileInfo.fileType,
      fileUrl: fileInfo.fileUrl,
      uploadedAt: new Date().toISOString(),
    };

    if (!employee.documents) {
      employee.documents = [];
    }
    employee.documents.push(doc);
    return doc;
  }
}
