import { SalaryStructure, SalarySlip, UpdateSalaryStructureDTO, GenerateSalarySlipDTO } from '../types/payroll.types';
import { AttendanceStatus } from '../config/constants';
import { prisma } from '../lib/prisma';

export class PayrollService {
  private static formatSalaryStructure(emp: any): SalaryStructure {
    const base = emp.salary ? Number(emp.salary) : 50000;
    // Calculate estimated components since database only stores base salary
    const hra = Math.round(base * 0.4);
    const allowances = 10000;
    const deductions = 4000;
    const net = base + hra + allowances - deductions;

    return {
      id: `sal_${emp.employee_code}`,
      employeeId: emp.employee_code,
      baseSalary: base,
      hra,
      allowances,
      deductions,
      netSalary: net,
      effectiveDate: emp.joining_date ? emp.joining_date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      createdAt: emp.created_at ? emp.created_at.toISOString() : new Date().toISOString(),
      updatedAt: emp.updated_at ? emp.updated_at.toISOString() : new Date().toISOString(),
    };
  }

  private static formatSalarySlip(p: any): SalarySlip {
    return {
      id: p.id,
      employeeId: p.employees?.employee_code || '',
      month: p.month,
      year: p.year,
      baseSalary: Number(p.basic_salary),
      hra: p.allowances ? Math.round(Number(p.basic_salary) * 0.4) : 0, // dynamic HRA estimation
      allowances: p.allowances ? Number(p.allowances) : 0,
      deductions: p.deductions ? Number(p.deductions) : 0,
      netSalary: Number(p.net_salary),
      // Default to standard working days estimation
      totalPresentDays: 20,
      totalLeaveDays: 2,
      totalAbsentDays: 0,
      status: p.status as 'GENERATED' | 'PAID',
      generatedAt: p.generated_at ? p.generated_at.toISOString() : p.created_at.toISOString(),
    };
  }

  static async getEmployeeSalaryStructure(employeeIdOrCode: string): Promise<SalaryStructure> {
    const employee = await prisma.employees.findFirst({
      where: {
        OR: [
          { id: employeeIdOrCode },
          { employee_code: employeeIdOrCode.toUpperCase() },
        ],
      },
    });

    if (!employee) {
      throw new Error('Salary structure not found for this employee');
    }

    return this.formatSalaryStructure(employee);
  }

  static async updateSalaryStructure(employeeIdOrCode: string, dto: UpdateSalaryStructureDTO): Promise<SalaryStructure> {
    const employee = await prisma.employees.findFirst({
      where: {
        OR: [
          { id: employeeIdOrCode },
          { employee_code: employeeIdOrCode.toUpperCase() },
        ],
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const updatedEmployee = await prisma.employees.update({
      where: { id: employee.id },
      data: {
        salary: dto.baseSalary,
      },
    });

    return this.formatSalaryStructure(updatedEmployee);
  }

  static async generateSalarySlip(dto: GenerateSalarySlipDTO): Promise<SalarySlip> {
    const employee = await prisma.employees.findFirst({
      where: {
        OR: [
          { id: dto.employeeId },
          { employee_code: dto.employeeId.toUpperCase() },
        ],
      },
    });

    if (!employee) {
      throw new Error('Cannot generate salary slip: Employee not found');
    }

    // Check if slip for this month & year already generated
    const existing = await prisma.payroll.findUnique({
      where: {
        employee_id_month_year: {
          employee_id: employee.id,
          month: dto.month,
          year: dto.year,
        },
      },
      include: { employees: true },
    });

    if (existing) {
      return this.formatSalarySlip(existing);
    }

    const base = employee.salary ? Number(employee.salary) : 50000;
    const allowances = 10000;
    const deductions = 4000;
    const net = base + Math.round(base * 0.4) + allowances - deductions;

    const slip = await prisma.payroll.create({
      data: {
        employee_id: employee.id,
        month: dto.month,
        year: dto.year,
        basic_salary: base,
        allowances: allowances,
        deductions: deductions,
        net_salary: net,
        status: 'GENERATED',
        generated_at: new Date(),
      },
      include: { employees: true },
    });

    return this.formatSalarySlip(slip);
  }

  static async getSalarySlips(employeeIdOrCode?: string): Promise<SalarySlip[]> {
    const whereClause: any = {};

    if (employeeIdOrCode) {
      const employee = await prisma.employees.findFirst({
        where: {
          OR: [
            { id: employeeIdOrCode },
            { employee_code: employeeIdOrCode.toUpperCase() },
          ],
        },
      });
      if (employee) {
        whereClause.employee_id = employee.id;
      }
    }

    const slips = await prisma.payroll.findMany({
      where: whereClause,
      include: { employees: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return slips.map(this.formatSalarySlip);
  }

  static async getSalarySlipById(slipId: string): Promise<SalarySlip> {
    const slip = await prisma.payroll.findUnique({
      where: { id: slipId },
      include: { employees: true },
    });

    if (!slip) {
      throw new Error('Salary slip not found');
    }

    return this.formatSalarySlip(slip);
  }
}

export const salarySlipsStore: any[] = [];
