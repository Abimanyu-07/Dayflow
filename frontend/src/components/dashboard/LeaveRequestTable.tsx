import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { LeaveRequest, leaveApi } from '@/services/leaveApi';
import { Check, X, CalendarCheck, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveRequestTableProps {
  initialRequests?: LeaveRequest[];
  onActionComplete?: () => void;
}

export const LeaveRequestTable: React.FC<LeaveRequestTableProps> = ({
  initialRequests = [],
  onActionComplete,
}) => {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  const handleApprove = async (id: string, name: string) => {
    try {
      await leaveApi.approveLeave(id);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
      );
      toast.success(`Approved leave request for ${name}`);
      if (onActionComplete) onActionComplete();
    } catch (err: unknown) {
      toast.error('Failed to approve leave request.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingId) return;
    setIsSubmitting(true);

    try {
      await leaveApi.rejectLeave(rejectingId, adminComment);
      const targetReq = requests.find((r) => r.id === rejectingId);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === rejectingId ? { ...r, status: 'REJECTED', adminComment } : r
        )
      );

      toast.success(`Rejected leave request for ${targetReq?.employeeName || 'employee'}`);
      setRejectingId(null);
      setAdminComment('');
      if (onActionComplete) onActionComplete();
    } catch (err: unknown) {
      toast.error('Failed to reject leave request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');

  return (
    <Card className="border-slate-200/80 shadow-sm">
      {/* Rejection Comment Dialog Modal */}
      {rejectingId && (
        <Dialog open={!!rejectingId} onOpenChange={() => setRejectingId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <X className="h-4 w-4 stroke-[2.5]" />
                </div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Reject Leave Request
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-500 pt-1">
                Provide an optional admin comment explaining the rejection decision.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Label htmlFor="admin-comment">Reason for Rejection (Optional)</Label>
              <textarea
                id="admin-comment"
                rows={3}
                placeholder="e.g. Mandatory project deadline during requested dates..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingId(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReject}
                isLoading={isSubmitting}
                loadingText="Rejecting..."
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Pending Leave Approvals
          </CardTitle>
        </div>
        <Badge variant="warning" className="bg-amber-100 text-amber-900 font-bold border-amber-200">
          {pendingRequests.length} Pending Action
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No leave requests to display.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div>
                      <span className="font-bold text-slate-900 block">{req.employeeName}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {req.employeeId} &bull; {req.department}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-800">
                    {req.leaveType}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-slate-700">
                    {req.dateRange}
                  </TableCell>

                  <TableCell className="max-w-[200px] text-xs text-slate-600 truncate">
                    {req.reason}
                  </TableCell>

                  <TableCell>
                    {req.status === 'PENDING' && (
                      <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200">
                        Pending
                      </Badge>
                    )}
                    {req.status === 'APPROVED' && (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        Approved
                      </Badge>
                    )}
                    {req.status === 'REJECTED' && (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                        Rejected
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id, req.employeeName)}
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-2.5"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectingId(req.id)}
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50 text-xs px-2.5"
                        >
                          <X className="mr-1 h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">Action Taken</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
