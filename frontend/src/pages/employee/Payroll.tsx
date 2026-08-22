import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SalaryCard } from '@/components/profile/SalaryCard';
import { PayslipTable } from '@/components/payroll/PayslipTable';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { payrollApi } from '@/services/payrollApi';
import { profileApi } from '@/services/profileApi';
import { Payslip } from '@/types/payroll';
import { SalaryStructure } from '@/types/employee';

export const EmployeePayrollPage: React.FC = () => {
  const [salary, setSalary] = useState<SalaryStructure | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPayrollData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [profileRes, payslipRes] = await Promise.all([
        profileApi.getMyProfile(),
        payrollApi.getMyPayslips(),
      ]);
      setSalary(profileRes.salary);
      setPayslips(payslipRes);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  return (
    <AppLayout title="My Salary & Payslip Statements">
      {isLoading ? (
        <LoadingState />
      ) : isError || !salary ? (
        <ErrorState onRetry={fetchPayrollData} title="Unable to load payroll statements" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Payroll & Payslips
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              View your monthly salary structure, tax deductions, and download payslip PDF statements.
            </p>
          </div>

          {/* Salary Breakdown Card */}
          <SalaryCard salary={salary} isHrView={false} />

          {/* Payslips History Table */}
          <PayslipTable payslips={payslips} />
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeePayrollPage;
