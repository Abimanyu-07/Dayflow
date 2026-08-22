import { api } from '@/lib/api';
import { Payslip, PayrollSummaryStats, UpdateSalaryPayload } from '@/types/payroll';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let mockPayslipsDatabase: Payslip[] = [
  {
    id: 'pay_101',
    employeeId: 'EMP1042',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    payPeriod: 'August 2026',
    basicSalary: 55000,
    allowances: 12000,
    deductions: 4500,
    netSalary: 62500,
    status: 'PAID',
    paidOn: 'Aug 01, 2026',
    paymentMethod: 'Direct Bank Deposit',
  },
  {
    id: 'pay_102',
    employeeId: 'EMP1043',
    employeeName: 'Marcus Vance',
    department: 'Product',
    payPeriod: 'August 2026',
    basicSalary: 62000,
    allowances: 14000,
    deductions: 5200,
    netSalary: 70800,
    status: 'PAID',
    paidOn: 'Aug 01, 2026',
    paymentMethod: 'Direct Bank Deposit',
  },
  {
    id: 'pay_103',
    employeeId: 'EMP1044',
    employeeName: 'Elena Rostova',
    department: 'Design',
    payPeriod: 'August 2026',
    basicSalary: 60000,
    allowances: 15000,
    deductions: 5000,
    netSalary: 70000,
    status: 'PENDING',
  },
  {
    id: 'pay_104',
    employeeId: 'EMP1045',
    employeeName: 'David Chen',
    department: 'Engineering',
    payPeriod: 'August 2026',
    basicSalary: 58000,
    allowances: 13000,
    deductions: 4800,
    netSalary: 66200,
    status: 'PENDING',
  },
  {
    id: 'pay_105',
    employeeId: 'EMP1046',
    employeeName: 'Sophia Martinez',
    department: 'Human Resources',
    payPeriod: 'August 2026',
    basicSalary: 48000,
    allowances: 10000,
    deductions: 3800,
    netSalary: 54200,
    status: 'PAID',
    paidOn: 'Aug 01, 2026',
    paymentMethod: 'Direct Bank Deposit',
  },
];

export const payrollApi = {
  async getMyPayslips(): Promise<Payslip[]> {
    if (USE_MOCK_API) {
      await delay(400);
      return mockPayslipsDatabase.filter(
        (p) => p.employeeId === 'EMP1042' || p.employeeName === 'Alex Morgan'
      );
    }
    const response = await api.get<Payslip[]>('/payroll/my');
    return response.data;
  },

  async getAllPayroll(params?: { search?: string; department?: string; status?: string }): Promise<{
    payslips: Payslip[];
    stats: PayrollSummaryStats;
  }> {
    if (USE_MOCK_API) {
      await delay(500);

      let filtered = [...mockPayslipsDatabase];

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.employeeName.toLowerCase().includes(q) ||
            p.employeeId.toLowerCase().includes(q) ||
            p.department.toLowerCase().includes(q)
        );
      }

      if (params?.department && params.department !== 'ALL') {
        filtered = filtered.filter(
          (p) => p.department.toUpperCase() === params.department?.toUpperCase()
        );
      }

      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((p) => p.status === params.status);
      }

      const totalDisbursement = filtered.reduce((acc, p) => acc + p.netSalary, 0);
      const pendingDisbursement = filtered
        .filter((p) => p.status === 'PENDING')
        .reduce((acc, p) => acc + p.netSalary, 0);
      const totalAllowances = filtered.reduce((acc, p) => acc + p.allowances, 0);
      const totalDeductions = filtered.reduce((acc, p) => acc + p.deductions, 0);
      const processedCount = filtered.filter((p) => p.status === 'PAID').length;

      return {
        payslips: filtered,
        stats: {
          totalDisbursement,
          pendingDisbursement,
          totalAllowances,
          totalDeductions,
          processedCount,
          totalEmployees: filtered.length,
        },
      };
    }

    const response = await api.get('/payroll/all', { params });
    return response.data;
  },

  async processDisbursement(id: string): Promise<Payslip> {
    if (USE_MOCK_API) {
      await delay(600);
      const target = mockPayslipsDatabase.find((p) => p.id === id);
      if (target) {
        target.status = 'PAID';
        target.paidOn = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        target.paymentMethod = 'Direct Bank Deposit';
      }
      return { ...target! };
    }

    const response = await api.post<Payslip>(`/payroll/${id}/disburse`);
    return response.data;
  },

  async updateSalaryStructure(id: string, payload: UpdateSalaryPayload): Promise<Payslip> {
    if (USE_MOCK_API) {
      await delay(500);
      const target = mockPayslipsDatabase.find((p) => p.id === id);
      if (target) {
        target.basicSalary = payload.basicSalary;
        target.allowances = payload.allowances;
        target.deductions = payload.deductions;
        target.netSalary = payload.basicSalary + payload.allowances - payload.deductions;
      }
      return { ...target! };
    }

    const response = await api.put<Payslip>(`/payroll/${id}/salary`, payload);
    return response.data;
  },
};
