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
import { Payslip } from '@/types/payroll';
import { Search, Filter, CreditCard, Check, Edit, Send } from 'lucide-react';
import { payrollApi } from '@/services/payrollApi';
import { toast } from 'sonner';

interface HrPayrollTableProps {
  payslips: Payslip[];
  onDisbursementSuccess: () => void;
  onEditSalaryClick: (pay: Payslip) => void;
}

export const HrPayrollTable: React.FC<HrPayrollTableProps> = ({
  payslips,
  onDisbursementSuccess,
  onEditSalaryClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDisburse = async (pay: Payslip) => {
    setProcessingId(pay.id);
    try {
      await payrollApi.processDisbursement(pay.id);
      toast.success(`Disbursed ${formatINR(pay.netSalary)} to ${pay.employeeName} (${pay.employeeId})`);
      onDisbursementSuccess();
    } catch (err: unknown) {
      toast.error('Failed to process salary disbursement.');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = payslips.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === 'ALL' ||
      p.department.toUpperCase() === departmentFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Workforce Payroll & Disbursements
          </CardTitle>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

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

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer px-1"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Disbursed (Paid)</option>
              <option value="PENDING">Pending Disbursement</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Payable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  No payroll records match your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell>
                    <div>
                      <span className="font-bold text-slate-900 block">{pay.employeeName}</span>
                      <span className="text-[11px] font-mono text-slate-400">{pay.employeeId}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-slate-700">
                    {pay.department}
                  </TableCell>

                  <TableCell className="font-mono text-slate-800 font-medium">
                    {formatINR(pay.basicSalary)}
                  </TableCell>

                  <TableCell className="font-mono text-emerald-700 font-medium">
                    + {formatINR(pay.allowances)}
                  </TableCell>

                  <TableCell className="font-mono text-red-600 font-medium">
                    - {formatINR(pay.deductions)}
                  </TableCell>

                  <TableCell className="font-mono font-extrabold text-slate-900 text-sm">
                    {formatINR(pay.netSalary)}
                  </TableCell>

                  <TableCell>
                    {pay.status === 'PAID' ? (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        Disbursed ({pay.paidOn || 'Aug 01'})
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="bg-amber-100 text-amber-900 border-amber-200">
                        Pending Payment
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {pay.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() => handleDisburse(pay)}
                          isLoading={processingId === pay.id}
                          loadingText="Disbursing..."
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-2.5"
                        >
                          <Send className="mr-1 h-3.5 w-3.5" /> Disburse
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditSalaryClick(pay)}
                        className="h-8 text-xs font-semibold"
                      >
                        <Edit className="mr-1 h-3.5 w-3.5" /> Edit Salary
                      </Button>
                    </div>
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
