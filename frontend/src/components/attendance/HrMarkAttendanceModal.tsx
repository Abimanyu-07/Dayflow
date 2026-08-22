import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AttendanceRecord, AttendanceStatus, MarkAttendancePayload } from '@/types/attendance';
import { attendanceApi } from '@/services/attendanceApi';
import { Clock, ShieldCheck, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface HrMarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRecord?: AttendanceRecord | null;
  onSuccess: (updated: AttendanceRecord) => void;
}

export const HrMarkAttendanceModal: React.FC<HrMarkAttendanceModalProps> = ({
  isOpen,
  onClose,
  targetRecord,
  onSuccess,
}) => {
  const [employeeId, setEmployeeId] = useState(targetRecord?.employeeId || 'EMP1044');
  const [employeeName, setEmployeeName] = useState(targetRecord?.employeeName || 'Elena Rostova');
  const [date, setDate] = useState(
    targetRecord?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [checkInTime, setCheckInTime] = useState(targetRecord?.checkInTime || '09:00 AM');
  const [checkOutTime, setCheckOutTime] = useState(targetRecord?.checkOutTime || '05:00 PM');
  const [status, setStatus] = useState<AttendanceStatus>(targetRecord?.status || 'PRESENT');
  const [notes, setNotes] = useState(targetRecord?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId.trim()) {
      toast.error('Employee ID is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: MarkAttendancePayload = {
        recordId: targetRecord?.id,
        employeeId: employeeId.trim(),
        employeeName: employeeName.trim(),
        date,
        checkInTime: status === 'PRESENT' || status === 'HALF_DAY' ? checkInTime : undefined,
        checkOutTime: status === 'PRESENT' || status === 'HALF_DAY' ? checkOutTime : undefined,
        status,
        notes: notes.trim(),
      };

      const result = await attendanceApi.markAttendance(payload);
      toast.success(`Attendance updated for ${result.employeeName} (${result.date})`);
      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      toast.error('Failed to update attendance record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {targetRecord ? 'Edit Employee Attendance' : 'Mark Employee Attendance'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            HR manual attendance log override and shift time adjustments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Employee ID & Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="empId">Employee ID *</Label>
              <Input
                id="empId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="EMP1044"
                className="h-9 text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="empName">Employee Name</Label>
              <Input
                id="empName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Elena Rostova"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label htmlFor="attDate">Log Date</Label>
            <Input
              id="attDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Aug 22, 2026"
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Attendance Status */}
          <div className="space-y-1">
            <Label htmlFor="attStatus">Attendance Status *</Label>
            <select
              id="attStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs text-slate-900 bg-white font-semibold"
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half-Day</option>
              <option value="LEAVE">On Leave</option>
            </select>
          </div>

          {/* Check-In & Check-Out Times */}
          {(status === 'PRESENT' || status === 'HALF_DAY') && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor="checkIn">Check-In Time</Label>
                <Input
                  id="checkIn"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="checkOut">Check-Out Time</Label>
                <Input
                  id="checkOut"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  placeholder="05:00 PM"
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-1">
            <Label htmlFor="notes">HR Override Note (Optional)</Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="e.g. Adjusted check-in time per manager confirmation."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving..."
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-sm"
            >
              Save Attendance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
