import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  EmployeeAttendanceReportItem,
  DepartmentPayrollPoint,
} from '@/types/reports';
import { Search, FileSpreadsheet, Users, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ReportsTableTabsProps {
  attendanceData: EmployeeAttendanceReportItem[];
  payrollData: DepartmentPayrollPoint[];
}

export const ReportsTableTabs: React.FC<ReportsTableTabsProps> = ({
  attendanceData,
  payrollData,
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'payroll'>('attendance');
  const [searchTerm, setSearchTerm] = useState('');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportTabCsv = () => {
    toast.success(`Exported ${activeTab.toUpperCase()} breakdown report to CSV file.`);
  };

  const filteredAttendance = attendanceData.filter(
    (a) =>
      a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-slate-200/80 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Staff Attendance Report
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'payroll'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" /> Department Payroll Summary
          </button>
        </div>

        {/* Search & Export Action */}
        <div className="flex items-center gap-2">
          {activeTab === 'attendance' && (
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search staff or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          )}

          <button
            onClick={handleExportTabCsv}
            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/60"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Export CSV
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {activeTab === 'attendance' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Present Days</TableHead>
                <TableHead>Absent Days</TableHead>
                <TableHead>Half Days</TableHead>
                <TableHead>Leave Days</TableHead>
                <TableHead className="text-right">Attendance Rate %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((item) => (
                <TableRow key={item.employeeId}>
                  <TableCell>
                    <div>
                      <span className="font-bold text-slate-900 block">{item.employeeName}</span>
                      <span className="text-[11px] font-mono text-slate-400">{item.employeeId}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-slate-700">{item.department}</TableCell>

                  <TableCell className="font-mono text-emerald-700 font-bold">{item.presentDays}d</TableCell>

                  <TableCell className="font-mono text-red-600 font-medium">{item.absentDays}d</TableCell>

                  <TableCell className="font-mono text-amber-600 font-medium">{item.halfDays}d</TableCell>

                  <TableCell className="font-mono text-blue-600 font-medium">{item.leaveDays}d</TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant={item.attendanceRate >= 95 ? 'success' : item.attendanceRate >= 90 ? 'secondary' : 'warning'}
                      className="font-mono font-extrabold text-xs"
                    >
                      {item.attendanceRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Staff Headcount</TableHead>
                <TableHead>Total Basic Salary</TableHead>
                <TableHead>Total Allowances</TableHead>
                <TableHead>Total Deductions</TableHead>
                <TableHead className="text-right">Total Net Payroll Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((dept) => (
                <TableRow key={dept.department}>
                  <TableCell className="font-bold text-slate-900">{dept.department}</TableCell>

                  <TableCell className="font-mono font-semibold text-slate-800">{dept.employeeCount} Members</TableCell>

                  <TableCell className="font-mono text-slate-800">{formatINR(dept.basicSalary)}</TableCell>

                  <TableCell className="font-mono text-emerald-700 font-medium">+ {formatINR(dept.allowances)}</TableCell>

                  <TableCell className="font-mono text-red-600 font-medium">- {formatINR(dept.deductions)}</TableCell>

                  <TableCell className="text-right font-mono font-extrabold text-slate-900 text-sm">
                    {formatINR(dept.netPayroll)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
