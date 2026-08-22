import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ReportsChartsSection } from '@/components/reports/ReportsChartsSection';
import { ReportsTableTabs } from '@/components/reports/ReportsTableTabs';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { reportsApi } from '@/services/reportsApi';
import {
  KpiMetrics,
  AttendanceTrendPoint,
  DepartmentPayrollPoint,
  LeaveDistributionPoint,
  EmployeeAttendanceReportItem,
} from '@/types/reports';
import {
  BarChart3,
  TrendingUp,
  Clock,
  IndianRupee,
  Calendar,
  Download,
  Printer,
  CalendarRange,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminReportsPage: React.FC = () => {
  const [period, setPeriod] = useState('current-month');
  const [kpis, setKpis] = useState<KpiMetrics | null>(null);
  const [trends, setTrends] = useState<AttendanceTrendPoint[]>([]);
  const [deptPayroll, setDeptPayroll] = useState<DepartmentPayrollPoint[]>([]);
  const [leaveDistribution, setLeaveDistribution] = useState<LeaveDistributionPoint[]>([]);
  const [attendanceReport, setAttendanceReport] = useState<EmployeeAttendanceReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchReportsData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [summaryRes, attRes] = await Promise.all([
        reportsApi.getReportsSummary(period),
        reportsApi.getAttendanceReport(),
      ]);
      setKpis(summaryRes.kpis);
      setTrends(summaryRes.trends);
      setDeptPayroll(summaryRes.departmentPayroll);
      setLeaveDistribution(summaryRes.leaveDistribution);
      setAttendanceReport(attRes);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [period]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportCsv = () => {
    toast.success('Generated full HR workforce analytics report (CSV format).');
  };

  const handlePrintPdf = () => {
    toast.info('Opening browser print dialogue for PDF export...');
    window.print();
  };

  return (
    <AppLayout title="HR Analytics & Workforce Reports">
      {isLoading ? (
        <LoadingState />
      ) : isError || !kpis ? (
        <ErrorState onRetry={fetchReportsData} title="Unable to load HR reports summary" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner & Period Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                HR Analytics & Reports
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Comprehensive workforce metrics, attendance trends, departmental payroll, and leave analytics.
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Period Dropdown Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 text-xs">
                <CalendarRange className="h-3.5 w-3.5 text-slate-500 ml-1" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer px-1"
                >
                  <option value="current-month">Current Month (Aug 2026)</option>
                  <option value="q3-2026">Q3 2026</option>
                  <option value="ytd-2026">Year to Date 2026</option>
                </select>
              </div>

              <Button
                onClick={handleExportCsv}
                size="sm"
                variant="outline"
                className="h-9 text-xs font-semibold"
              >
                <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Export CSV
              </Button>

              <Button
                onClick={handlePrintPdf}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Export PDF
              </Button>
            </div>
          </div>

          {/* 4 Summary KPI Metric Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Attendance Rate"
              value={`${kpis.attendanceRate}%`}
              subtitle="Overall shift compliance rate"
              icon={<TrendingUp className="h-5 w-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
              badgeText="High Performance"
              badgeVariant="success"
            />

            <StatCard
              title="Timely Check-Ins"
              value={`${kpis.ontimeRate}%`}
              subtitle="On-time arrival rate"
              icon={<Clock className="h-5 w-5" />}
              iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
              badgeText="Punctual"
              badgeVariant="secondary"
            />

            <StatCard
              title="Monthly Payroll Cost"
              value={formatINR(kpis.totalPayrollCost)}
              subtitle={`Distributed across ${kpis.totalStaffCount} staff members`}
              icon={<IndianRupee className="h-5 w-5" />}
              iconBgColor="bg-indigo-50 text-indigo-600 border-indigo-200"
              badgeText="Budget"
              badgeVariant="secondary"
            />

            <StatCard
              title="Approved Leave Days"
              value={`${kpis.approvedLeaveDays} Days`}
              subtitle="Time-off days taken in period"
              icon={<Calendar className="h-5 w-5" />}
              iconBgColor="bg-amber-50 text-amber-600 border-amber-200"
              badgeText="Approved"
              badgeVariant="warning"
            />
          </div>

          {/* Recharts Diagrams Section */}
          <ReportsChartsSection
            trends={trends}
            departmentPayroll={deptPayroll}
            leaveDistribution={leaveDistribution}
          />

          {/* Detailed Report Breakdown Tables with Tabs */}
          <ReportsTableTabs
            attendanceData={attendanceReport}
            payrollData={deptPayroll}
          />
        </div>
      )}
    </AppLayout>
  );
};

export default AdminReportsPage;
