export interface SalaryStructure {
  id: string;
  employeeId: string;
  baseSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  month: number; // 1 - 12
  year: number;
  baseSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  totalPresentDays: number;
  totalLeaveDays: number;
  totalAbsentDays: number;
  status: 'GENERATED' | 'PAID';
  generatedAt: string;
}

export interface UpdateSalaryStructureDTO {
  baseSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  effectiveDate?: string;
}

export interface GenerateSalarySlipDTO {
  employeeId: string;
  month: number;
  year: number;
}
