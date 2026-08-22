import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceSummaryStats } from '@/types/attendance';
import { CheckCircle2, XCircle, AlertTriangle, Calendar, Clock } from 'lucide-react';

interface AttendanceStatsGridProps {
  stats: AttendanceSummaryStats;
  isHrView?: boolean;
}

export const AttendanceStatsGrid: React.FC<AttendanceStatsGridProps> = ({
  stats,
  isHrView = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={isHrView ? 'Present Today' : 'Total Days Present'}
        value={stats.presentCount}
        subtitle={isHrView ? `Over ${stats.totalDays} logged staff` : `Out of ${stats.totalDays} working days`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
        badgeText={`${stats.attendanceRate}% Rate`}
        badgeVariant="success"
      />

      <StatCard
        title={isHrView ? 'Absent Today' : 'Days Absent'}
        value={stats.absentCount}
        subtitle="Unexcused leave or missing log"
        icon={<XCircle className="h-5 w-5" />}
        iconBgColor="bg-red-50 text-red-600 border-red-200"
        badgeText={stats.absentCount > 0 ? 'Review' : 'Clear'}
        badgeVariant={stats.absentCount > 0 ? 'destructive' : 'secondary'}
      />

      <StatCard
        title="Half-Day Shifts"
        value={stats.halfDayCount}
        subtitle="4-hour partial day logs"
        icon={<AlertTriangle className="h-5 w-5" />}
        iconBgColor="bg-amber-50 text-amber-600 border-amber-200"
        badgeText="Partial"
        badgeVariant="warning"
      />

      <StatCard
        title={isHrView ? 'On Approved Leave' : 'Approved Leave Days'}
        value={stats.leaveCount}
        subtitle="Medical & annual leave requests"
        icon={<Calendar className="h-5 w-5" />}
        iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
        badgeText="Approved"
        badgeVariant="secondary"
      />
    </div>
  );
};
