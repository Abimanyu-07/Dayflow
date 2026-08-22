import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { HrPayrollTable } from '@/components/payroll/HrPayrollTable';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { payrollApi } from '@/services/payrollApi';
import { Payslip, PayrollSummaryStats } from '@/types/payroll';
import { CreditCard, IndianRupee, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminPayrollPage: React.FC = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [stats, setStats] = useState<PayrollSummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPayroll = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await payrollApi.getAllPayroll();
      setPayslips(data.payslips);
      setStats(data.stats);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <AppLayout title="HR Payroll & Disbursement Administration">
      {isLoading ? (
        <LoadingState />
      ) : isError || !stats ? (
        <ErrorState onRetry={fetchPayroll} title="Unable to load payroll summary" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Payroll Management
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Manage organization salary structures, allowances, deductions, and monthly disbursements.
            </p>
          </div>

          {/* 4 Summary Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Monthly Payroll"
              value={formatINR(stats.totalDisbursement)}
              subtitle={`Total net pay for ${stats.totalEmployees} staff members`}
              icon={<IndianRupee className="h-5 w-5" />}
              iconBgColor="bg-slate-100 text-slate-800 border-slate-200"
              badgeText="Monthly"
              badgeVariant="secondary"
            />

            <StatCard
              title="Pending Disbursements"
              value={formatINR(stats.pendingDisbursement)}
              subtitle="Awaiting bank transfer approval"
              icon={<AlertCircle className="h-5 w-5" />}
              iconBgColor="bg-amber-50 text-amber-600 border-amber-200"
              badgeText={stats.pendingDisbursement > 0 ? 'Requires Action' : 'Disbursed'}
              badgeVariant={stats.pendingDisbursement > 0 ? 'warning' : 'success'}
            />

            <StatCard
              title="Total Allowances"
              value={formatINR(stats.totalAllowances)}
              subtitle="HRA, TA, and special allowances"
              icon={<CreditCard className="h-5 w-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
              badgeText="Earnings"
              badgeVariant="success"
            />

            <StatCard
              title="Processed Employees"
              value={`${stats.processedCount} / ${stats.totalEmployees}`}
              subtitle="Direct bank deposits completed"
              icon={<CheckCircle2 className="h-5 w-5" />}
              iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
              badgeText={`${Math.round((stats.processedCount / (stats.totalEmployees || 1)) * 100)}% Done`}
              badgeVariant="secondary"
            />
          </div>

          {/* Workforce Payroll Table */}
          <HrPayrollTable
            payslips={payslips}
            onDisbursementSuccess={fetchPayroll}
            onEditSalaryClick={(pay) =>
              toast.info(`Editing salary for ${pay.employeeName} (${pay.employeeId})`)
            }
          />
        </div>
      )}
    </AppLayout>
  );
};

export default AdminPayrollPage;
