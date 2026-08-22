import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceCard } from '@/components/dashboard/AttendanceCard';
import { AttendanceStatsGrid } from '@/components/attendance/AttendanceStatsGrid';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { attendanceApi } from '@/services/attendanceApi';
import { AttendanceRecord, AttendanceSummaryStats } from '@/types/attendance';

export const EmployeeAttendancePage: React.FC = () => {
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceSummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [todayRes, myRes] = await Promise.all([
        attendanceApi.getTodayAttendance(),
        attendanceApi.getMyAttendance(),
      ]);
      setTodayRecord(todayRes);
      setRecords(myRes.records);
      setStats(myRes.stats);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return (
    <AppLayout title="My Attendance Logs">
      {isLoading ? (
        <LoadingState />
      ) : isError || !stats ? (
        <ErrorState onRetry={fetchAttendanceData} title="Unable to load attendance records" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Top Banner Grid: Today's Shift Card & Summary Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 xl:col-span-4">
              <AttendanceCard
                initialAttendance={todayRecord || undefined}
                onAttendanceUpdate={(updated) => {
                  setTodayRecord(updated);
                  fetchAttendanceData();
                }}
              />
            </div>

            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Monthly Attendance Overview
              </h3>
              <AttendanceStatsGrid stats={stats} isHrView={false} />
            </div>
          </div>

          {/* Personal Attendance Logs Table */}
          <AttendanceTable records={records} isHrView={false} />
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeAttendancePage;
