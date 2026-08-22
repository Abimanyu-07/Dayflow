import { SalaryStructure, SalarySlip, UpdateSalaryStructureDTO, GenerateSalarySlipDTO } from '../types/payroll.types';
import { employeesStore } from './employee.service';
import { attendanceStore } from './attendance.service';
import { AttendanceStatus } from '../config/constants';

// In-memory salary slips store
export const salarySlipsStore: SalarySlip[] = [
  {
    id: 'slip_1',
    employeeId: 'EMP-101',
    month: 8,
    year: 2026,
    baseSalary: 80000,
    hra: 32000,
    allowances: 15000,
    deductions: 7000,
    netSalary: 120000,
    totalPresentDays: 20,
    totalLeaveDays: 2,
    totalAbsentDays: 0,
    status: 'PAID',
    generatedAt: new Date().toISOString(),
  },
];

export class PayrollService {
  static async getEmployeeSalaryStructure(employeeId: string): Promise<SalaryStructure> {
    const employee = employeesStore.find(
      (e) => e.id === employeeId || e.employeeId.toUpperCase() === employeeId.toUpperCase()
    );

    if (!employee || !employee.salaryStructure) {
      throw new Error('Salary structure not found for this employee');
    }

    return {
      id: `sal_${employee.employeeId}`,
      employeeId: employee.employeeId,
      baseSalary: employee.salaryStructure.baseSalary,
      hra: employee.salaryStructure.hra,
      allowances: employee.salaryStructure.allowances,
      deductions: employee.salaryStructure.deductions,
      netSalary: employee.salaryStructure.netSalary,
      effectiveDate: employee.salaryStructure.effectiveDate,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  static async updateSalaryStructure(employeeId: string, dto: UpdateSalaryStructureDTO): Promise<SalaryStructure> {
    const employee = employeesStore.find(
      (e) => e.id === employeeId || e.employeeId.toUpperCase() === employeeId.toUpperCase()
    );

    if (!employee) {
      throw new Error('Employee not found');
    }

    const netSalary = dto.baseSalary + dto.hra + dto.allowances - dto.deductions;

    employee.salaryStructure = {
      baseSalary: dto.baseSalary,
      hra: dto.hra,
      allowances: dto.allowances,
      deductions: dto.deductions,
      netSalary,
      effectiveDate: dto.effectiveDate || new Date().toISOString().split('T')[0],
    };
    employee.updatedAt = new Date().toISOString();

    return {
      id: `sal_${employee.employeeId}`,
      employeeId: employee.employeeId,
      ...employee.salaryStructure,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  static async generateSalarySlip(dto: GenerateSalarySlipDTO): Promise<SalarySlip> {
    const employee = employeesStore.find(
      (e) => e.id === dto.employeeId || e.employeeId.toUpperCase() === dto.employeeId.toUpperCase()
    );

    if (!employee || !employee.salaryStructure) {
      throw new Error('Cannot generate salary slip: Employee or salary structure not found');
    }

    // Check if slip for this month & year already generated
    const existing = salarySlipsStore.find(
      (s) => s.employeeId === employee.employeeId && s.month === dto.month && s.year === dto.year
    );

    if (existing) {
      return existing;
    }

    // Compute attendance statistics for the month
    const monthPrefix = `${dto.year}-${String(dto.month).padStart(2, '0')}`;
    const monthlyAtt = attendanceStore.filter(
      (a) => a.employeeId === employee.employeeId && a.date.startsWith(monthPrefix)
    );

    let totalPresentDays = 0;
    let totalLeaveDays = 0;
    let totalAbsentDays = 0;

    monthlyAtt.forEach((a) => {
      if (a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.HALF_DAY) totalPresentDays++;
      else if (a.status === AttendanceStatus.LEAVE) totalLeaveDays++;
      else if (a.status === AttendanceStatus.ABSENT) totalAbsentDays++;
    });

    const slip: SalarySlip = {
      id: `slip_${Date.now()}`,
      employeeId: employee.employeeId,
      month: dto.month,
      year: dto.year,
      baseSalary: employee.salaryStructure.baseSalary,
      hra: employee.salaryStructure.hra,
      allowances: employee.salaryStructure.allowances,
      deductions: employee.salaryStructure.deductions,
      netSalary: employee.salaryStructure.netSalary,
      totalPresentDays,
      totalLeaveDays,
      totalAbsentDays,
      status: 'GENERATED',
      generatedAt: new Date().toISOString(),
    };

    salarySlipsStore.unshift(slip);
    return slip;
  }

  static async getSalarySlips(employeeId?: string): Promise<SalarySlip[]> {
    if (employeeId) {
      return salarySlipsStore.filter((s) => s.employeeId === employeeId);
    }
    return salarySlipsStore;
  }

  static async getSalarySlipById(slipId: string): Promise<SalarySlip> {
    const slip = salarySlipsStore.find((s) => s.id === slipId);
    if (!slip) {
      throw new Error('Salary slip not found');
    }
    return slip;
  }
}
