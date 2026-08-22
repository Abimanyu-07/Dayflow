import {
  EmployeeProfile,
  EmployeeSelfUpdateDTO,
  AdminEmployeeUpdateDTO,
  EmployeeDocumentSummary,
} from '../types/employee.types';
import { UserRole } from '../config/constants';
import { prisma } from '../lib/prisma';

export class EmployeeService {
  private static formatProfile(emp: any): EmployeeProfile {
    return {
      id: emp.id,
      userId: emp.user_id,
      employeeId: emp.employee_code,
      email: emp.users?.email || '',
      role: (emp.users?.role as UserRole) || UserRole.EMPLOYEE,
      firstName: emp.first_name,
      lastName: emp.last_name || '',
      phone: emp.phone || undefined,
      profilePicture: emp.profile_image || undefined,
      department: emp.departments?.name || undefined,
      designation: emp.designation || undefined,
      joiningDate: emp.joining_date ? emp.joining_date.toISOString().split('T')[0] : undefined,
      createdAt: emp.created_at ? emp.created_at.toISOString() : new Date().toISOString(),
      updatedAt: emp.updated_at ? emp.updated_at.toISOString() : new Date().toISOString(),
      // Add mock defaults for required frontend fields that aren't in DB yet
      address: undefined,
      employmentStatus: 'Active',
      salaryStructure: emp.salary ? {
        baseSalary: Number(emp.salary),
        hra: 0,
        allowances: 0,
        deductions: 0,
        netSalary: Number(emp.salary),
        effectiveDate: new Date().toISOString(),
      } : undefined,
      documents: [],
    };
  }

  static async getAllEmployees(query?: { department?: string; search?: string }): Promise<EmployeeProfile[]> {
    const whereClause: any = {};
    if (query?.department) {
      whereClause.departments = { name: { equals: query.department, mode: 'insensitive' } };
    }
    if (query?.search) {
      whereClause.OR = [
        { first_name: { contains: query.search, mode: 'insensitive' } },
        { last_name: { contains: query.search, mode: 'insensitive' } },
        { employee_code: { contains: query.search, mode: 'insensitive' } },
        { users: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const employees = await prisma.employees.findMany({
      where: whereClause,
      include: { users: true, departments: true },
    });

    return employees.map(this.formatProfile);
  }

  static async getEmployeeById(idOrEmployeeId: string): Promise<EmployeeProfile> {
    const employee = await prisma.employees.findFirst({
      where: {
        OR: [
          { id: idOrEmployeeId },
          { employee_code: idOrEmployeeId },
          { user_id: idOrEmployeeId },
        ],
      },
      include: { users: true, departments: true },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return this.formatProfile(employee);
  }

  static async getMyProfile(userId: string): Promise<EmployeeProfile> {
    const employee = await prisma.employees.findUnique({
      where: { user_id: userId },
      include: { users: true, departments: true },
    });

    if (!employee) {
      throw new Error('Employee profile not found for this user');
    }

    return this.formatProfile(employee);
  }

  static async updateSelfProfile(userId: string, dto: EmployeeSelfUpdateDTO): Promise<EmployeeProfile> {
    const employee = await prisma.employees.findUnique({
      where: { user_id: userId },
      include: { users: true, departments: true },
    });

    if (!employee) {
      throw new Error('Employee profile not found');
    }

    const updated = await prisma.employees.update({
      where: { id: employee.id },
      data: {
        phone: dto.phone !== undefined ? dto.phone : employee.phone,
        profile_image: dto.profilePicture !== undefined ? dto.profilePicture : employee.profile_image,
      },
      include: { users: true, departments: true },
    });

    return this.formatProfile(updated);
  }

  static async updateEmployeeByAdmin(idOrEmployeeId: string, dto: AdminEmployeeUpdateDTO): Promise<EmployeeProfile> {
    const employee = await prisma.employees.findFirst({
      where: {
        OR: [{ id: idOrEmployeeId }, { employee_code: idOrEmployeeId }],
      },
      include: { users: true, departments: true },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Handle department updates if needed (omitted for brevity, requires finding department ID)
    const updated = await prisma.employees.update({
      where: { id: employee.id },
      data: {
        first_name: dto.firstName !== undefined ? dto.firstName : employee.first_name,
        last_name: dto.lastName !== undefined ? dto.lastName : employee.last_name,
        phone: dto.phone !== undefined ? dto.phone : employee.phone,
        designation: dto.designation !== undefined ? dto.designation : employee.designation,
        joining_date: dto.joiningDate ? new Date(dto.joiningDate) : employee.joining_date,
        salary: dto.baseSalary !== undefined ? dto.baseSalary : employee.salary,
      },
      include: { users: true, departments: true },
    });

    if (dto.email || dto.role) {
      await prisma.users.update({
        where: { id: employee.user_id },
        data: {
          email: dto.email,
          role: dto.role,
        },
      });
    }

    const finalEmployee = await prisma.employees.findUnique({
      where: { id: employee.id },
      include: { users: true, departments: true },
    });

    return this.formatProfile(finalEmployee!);
  }

  static async addDocument(
    employeeId: string,
    fileInfo: { fileName: string; fileType: string; fileUrl: string }
  ): Promise<EmployeeDocumentSummary> {
    // Requires a documents table in DB. For now, mock it.
    return {
      id: `doc_${Date.now()}`,
      fileName: fileInfo.fileName,
      fileType: fileInfo.fileType,
      fileUrl: fileInfo.fileUrl,
      uploadedAt: new Date().toISOString(),
    };
  }
}

export const employeesStore: EmployeeProfile[] = [];
