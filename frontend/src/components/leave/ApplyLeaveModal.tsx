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
import { LeaveType, CreateLeavePayload, LeaveRequestItem } from '@/types/leave';
import { leaveApi } from '@/services/leaveApi';
import { Calendar, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newLeave: LeaveRequestItem) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return 0;
    }
  };

  const durationDays = calculateDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a brief reason for your leave request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateLeavePayload = {
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      };

      const result = await leaveApi.applyLeave(payload);
      toast.success(`Leave request submitted for ${result.dateRange}`);
      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      toast.error('Failed to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Apply for Leave
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            Submit a new time-off request for HR approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Leave Type */}
          <div className="space-y-1">
            <Label htmlFor="leaveType">Leave Type *</Label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs text-slate-900 bg-white font-semibold"
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Duration Badge */}
          {durationDays > 0 && (
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-blue-600" /> Requested Duration:
              </span>
              <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 font-mono">
                {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <textarea
              id="reason"
              rows={3}
              placeholder="e.g. Family medical vacation and travel downtime..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
              loadingText="Submitting..."
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-sm"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
