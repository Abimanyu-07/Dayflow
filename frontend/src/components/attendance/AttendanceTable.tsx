import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, Filter, Calendar, Clock, Edit, ShieldCheck } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  isHrView?: boolean;
  onEditClick?: (record: AttendanceRecord) => void;
  onMarkNewClick?: () => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  isHrView = false,
  onEditClick,
  onMarkNewClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.date.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === 'ALL' ||
      r.department.toUpperCase() === departmentFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200">Present</Badge>;
      case 'ABSENT':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Absent</Badge>;
      case 'HALF_DAY':
        return <Badge variant="warning" className="bg-amber-100 text-amber-900 border-amber-200">Half-Day</Badge>;
      case 'LEAVE':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-900 border-blue-200">On Leave</Badge>;
      case 'NOT_CHECKED_IN':
      default:
        return <Badge variant="outline" className="bg-slate-100 text-slate-600">Not Checked In</Badge>;
    }
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            {isHrView ? 'Workforce Attendance Logs' : 'Personal Attendance History'}
          </CardTitle>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder={isHrView ? 'Search name or ID...' : 'Search date...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Department Filter (HR view) */}
          {isHrView && (
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-500 ml-1" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">All Depts</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="PRODUCT">Product</option>
                <option value="DESIGN">Design</option>
                <option value="HUMAN RESOURCES">HR</option>
                <option value="FINANCE">Finance</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer px-1"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half-Day</option>
              <option value="LEAVE">On Leave</option>
            </select>
          </div>

          {/* HR Manual Mark Button */}
          {isHrView && onMarkNewClick && (
            <Button
              onClick={onMarkNewClick}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9"
            >
              Mark / Edit Attendance
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {isHrView && <TableHead>Employee</TableHead>}
              {isHrView && <TableHead>Department</TableHead>}
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Status</TableHead>
              {isHrView && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isHrView ? 8 : 5} className="text-center py-8">
                  <EmptyState
                    title="No attendance logs found"
                    description="No attendance records match your active search or filter criteria."
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-mono font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {rec.date}
                    </span>
                  </TableCell>

                  {isHrView && (
                    <TableCell>
                      <div>
                        <span className="font-bold text-slate-900 block">{rec.employeeName}</span>
                        <span className="text-[11px] font-mono text-slate-400">{rec.employeeId}</span>
                      </div>
                    </TableCell>
                  )}

                  {isHrView && (
                    <TableCell className="font-medium text-slate-700">
                      {rec.department}
                    </TableCell>
                  )}

                  <TableCell className="font-mono text-slate-800 font-semibold">
                    {rec.checkInTime || '--:--'}
                  </TableCell>

                  <TableCell className="font-mono text-slate-800 font-semibold">
                    {rec.checkOutTime || '--:--'}
                  </TableCell>

                  <TableCell className="font-mono text-emerald-700 font-bold text-xs">
                    {rec.workingDuration || '--'}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(rec.status)}
                  </TableCell>

                  {isHrView && (
                    <TableCell className="text-right">
                      {onEditClick && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditClick(rec)}
                          className="h-8 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" /> Edit Log
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
