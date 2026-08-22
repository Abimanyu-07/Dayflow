import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceStatsGrid } from '@/components/attendance/AttendanceStatsGrid';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { HrMarkAttendanceModal } from '@/components/attendance/HrMarkAttendanceModal';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { attendanceApi } from '@/services/attendanceApi';
import { AttendanceRecord, AttendanceSummaryStats } from '@/types/attendance';
import { Button } from '@/components/ui/button';
import { Plus, Users, Clock } from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceSummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const fetchAttendanceLogs = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await attendanceApi.getAllAttendance();
      setRecords(data.records);
      setStats(data.stats);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceLogs();
  }, []);

  const handleEditRecord = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setIsModalOpen(true);
  };

  const handleCreateRecord = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  return (
    <AppLayout title="HR Workforce Attendance Management">
      {isLoading ? (
        <LoadingState />
      ) : isError || !stats ? (
        <ErrorState onRetry={fetchAttendanceLogs} title="Unable to load workforce attendance logs" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner & Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Workforce Attendance
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Monitor employee check-ins, shift hours, and HR manual overrides.
              </p>
            </div>

            <Button
              onClick={handleCreateRecord}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-10 px-4 shadow-sm self-start sm:self-center"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Mark / Override Attendance
            </Button>
          </div>

          {/* Attendance Stats Grid */}
          <AttendanceStatsGrid stats={stats} isHrView={true} />

          {/* Attendance Log Table */}
          <AttendanceTable
            records={records}
            isHrView={true}
            onEditClick={handleEditRecord}
            onMarkNewClick={handleCreateRecord}
          />

          {/* HR Manual Mark/Edit Modal Dialog */}
          {isModalOpen && (
            <HrMarkAttendanceModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingRecord(null);
              }}
              targetRecord={editingRecord}
              onSuccess={fetchAttendanceLogs}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default AdminAttendancePage;
