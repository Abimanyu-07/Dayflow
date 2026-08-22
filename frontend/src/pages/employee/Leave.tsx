import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeaveBalanceCards } from '@/components/leave/LeaveBalanceCards';
import { ApplyLeaveModal } from '@/components/leave/ApplyLeaveModal';
import { LeaveRequestTable } from '@/components/dashboard/LeaveRequestTable';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { leaveApi } from '@/services/leaveApi';
import { LeaveBalance, LeaveRequestItem } from '@/types/leave';
import { Plus } from 'lucide-react';

export const EmployeeLeavePage: React.FC = () => {
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [requests, setRequests] = useState<LeaveRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaveData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [balRes, reqRes] = await Promise.all([
        leaveApi.getLeaveBalance(),
        leaveApi.getMyLeaves(),
      ]);
      setBalance(balRes);
      setRequests(reqRes);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  return (
    <AppLayout title="My Leave Applications & Allowances">
      {isLoading ? (
        <LoadingState />
      ) : isError || !balance ? (
        <ErrorState onRetry={fetchLeaveData} title="Unable to load leave details" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner & Primary Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Leave Management
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Apply for time-off and track leave balances and approval status.
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-10 px-4 shadow-sm self-start sm:self-center"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Apply for Leave
            </Button>
          </div>

          {/* Leave Balance Metric Cards */}
          <LeaveBalanceCards balance={balance} />

          {/* Personal Leave Requests Table */}
          <LeaveRequestTable
            initialRequests={requests}
            onActionComplete={fetchLeaveData}
          />

          {/* Apply Leave Modal */}
          {isModalOpen && (
            <ApplyLeaveModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={fetchLeaveData}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeLeavePage;
