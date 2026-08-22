import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AttendanceRecord } from '@/types/attendance';
import { attendanceApi } from '@/services/attendanceApi';
import { Clock, LogIn, LogOut, CheckCircle2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceCardProps {
  initialAttendance?: AttendanceRecord;
  onAttendanceUpdate?: (record: AttendanceRecord) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  initialAttendance,
  onAttendanceUpdate,
}) => {
  const [attendance, setAttendance] = useState<AttendanceRecord>(
    initialAttendance || {
      id: 'att_101',
      userId: 'usr_emp_01',
      employeeId: 'EMP1042',
      employeeName: 'Alex Morgan',
      department: 'Engineering',
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'NOT_CHECKED_IN',
    }
  );

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const updated = await attendanceApi.checkIn();
      setAttendance(updated);
      toast.success(`Checked in successfully at ${updated.checkInTime}`);
      if (onAttendanceUpdate) onAttendanceUpdate(updated);
    } catch (err: unknown) {
      toast.error('Failed to check in. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const updated = await attendanceApi.checkOut();
      setAttendance(updated);
      toast.success(`Checked out successfully at ${updated.checkOutTime}`);
      if (onAttendanceUpdate) onAttendanceUpdate(updated);
    } catch (err: unknown) {
      toast.error('Failed to check out. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isCheckedIn = attendance.status === 'PRESENT' && !attendance.checkOutTime;
  const isCompleted = !!attendance.checkOutTime;
  const isNotCheckedIn = attendance.status === 'NOT_CHECKED_IN';

  return (
    <Card className="border-slate-200/80 shadow-md bg-gradient-to-br from-white via-white to-slate-50/60">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Clock className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <CardTitle className="text-lg font-extrabold text-slate-900">
              Today's Attendance
            </CardTitle>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <Calendar className="h-3 w-3 text-slate-400" />
              {attendance.date}
            </p>
          </div>
        </div>

        {/* Attendance Status Badge */}
        {isNotCheckedIn && (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 font-bold border-slate-300">
            Not Checked In
          </Badge>
        )}
        {isCheckedIn && (
          <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-bold border-emerald-200">
            Present & Active
          </Badge>
        )}
        {isCompleted && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-900 font-bold border-blue-200">
            Completed Shift
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Check-In / Check-Out Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-100/70 border border-slate-200/60 text-center">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Check-in
            </span>
            <span className="text-sm font-extrabold text-slate-900 block font-mono">
              {attendance.checkInTime || '--:--'}
            </span>
          </div>

          <div className="space-y-0.5 border-x border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Check-out
            </span>
            <span className="text-sm font-extrabold text-slate-900 block font-mono">
              {attendance.checkOutTime || '--:--'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Working time
            </span>
            <span className="text-sm font-extrabold text-emerald-700 block font-mono">
              {attendance.workingDuration || (isCheckedIn ? 'In progress' : '--')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          {isNotCheckedIn && (
            <Button
              onClick={handleCheckIn}
              isLoading={isCheckingIn}
              loadingText="Checking in..."
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 text-sm shadow-md"
            >
              <LogIn className="mr-2 h-4 w-4" /> Check In
            </Button>
          )}

          {isCheckedIn && (
            <Button
              onClick={handleCheckOut}
              isLoading={isCheckingOut}
              loadingText="Checking out..."
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 text-sm shadow-md"
            >
              <LogOut className="mr-2 h-4 w-4" /> Check Out
            </Button>
          )}

          {isCompleted && (
            <Button
              disabled
              variant="outline"
              className="w-full bg-slate-100 text-slate-500 font-semibold h-11 text-xs border-slate-200"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Shift Completed Today
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
