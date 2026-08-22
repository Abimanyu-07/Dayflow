export type DisbursementStatus = 'PAID' | 'PENDING' | 'PROCESSING';

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  payPeriod: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: DisbursementStatus;
  paidOn?: string;
  paymentMethod?: string;
}

export interface PayrollSummaryStats {
  totalDisbursement: number;
  pendingDisbursement: number;
  totalAllowances: number;
  totalDeductions: number;
  processedCount: number;
  totalEmployees: number;
}

export interface UpdateSalaryPayload {
  basicSalary: number;
  allowances: number;
  deductions: number;
}
