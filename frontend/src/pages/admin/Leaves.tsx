import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeaveRequestTable } from '@/components/dashboard/LeaveRequestTable';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { leaveApi } from '@/services/leaveApi';
import { LeaveRequestItem } from '@/types/leave';
import { AlertCircle, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';

export const AdminLeavesPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchLeaves = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await leaveApi.getAllLeaves({ status: statusFilter });
      setRequests(data);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <AppLayout title="HR Leave Approvals & Administration">
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={fetchLeaves} title="Unable to load leave requests" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Leave Approvals
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Review, approve, or reject workforce leave requests.
              </p>
            </div>

            {/* Status Filter selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 text-xs self-start sm:self-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer px-2"
              >
                <option value="ALL">All Applications ({requests.length})</option>
                <option value="PENDING">Pending Approval ({pendingCount})</option>
                <option value="APPROVED">Approved ({approvedCount})</option>
                <option value="REJECTED">Rejected ({rejectedCount})</option>
              </select>
            </div>
          </div>

          {/* Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Pending Action"
              value={pendingCount}
              subtitle="Awaiting HR review"
              icon={<AlertCircle className="h-5 w-5" />}
              iconBgColor="bg-amber-50 text-amber-600 border-amber-200"
              badgeText={pendingCount > 0 ? 'Requires Action' : 'Cleared'}
              badgeVariant={pendingCount > 0 ? 'warning' : 'success'}
            />

            <StatCard
              title="Approved Applications"
              value={approvedCount}
              subtitle="Granted employee time-off"
              icon={<CheckCircle2 className="h-5 w-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
              badgeText="Approved"
              badgeVariant="success"
            />

            <StatCard
              title="Rejected Applications"
              value={rejectedCount}
              subtitle="Declined with admin feedback"
              icon={<XCircle className="h-5 w-5" />}
              iconBgColor="bg-red-50 text-red-600 border-red-200"
              badgeText="Declined"
              badgeVariant="destructive"
            />
          </div>

          {/* Leave Approvals Table */}
          <LeaveRequestTable
            initialRequests={requests}
            isHrView={true}
            onActionComplete={fetchLeaves}
          />
        </div>
      )}
    </AppLayout>
  );
};

export default AdminLeavesPage;
