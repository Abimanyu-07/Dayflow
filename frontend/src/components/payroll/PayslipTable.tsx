import React from 'react';
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
import { Payslip } from '@/types/payroll';
import { CreditCard, Download, CheckCircle2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface PayslipTableProps {
  payslips: Payslip[];
}

export const PayslipTable: React.FC<PayslipTableProps> = ({ payslips }) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDownloadPdf = (period: string) => {
    toast.success(`Downloading Payslip PDF statement for ${period}...`);
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Payslip Statements & History
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pay Period</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Monthly Salary</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No payslips generated yet.
                </TableCell>
              </TableRow>
            ) : (
              payslips.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-bold text-slate-900 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {pay.payPeriod}
                    </span>
                  </TableCell>

                  <TableCell className="font-mono text-slate-800">
                    {formatINR(pay.basicSalary)}
                  </TableCell>

                  <TableCell className="font-mono text-emerald-700 font-medium">
                    + {formatINR(pay.allowances)}
                  </TableCell>

                  <TableCell className="font-mono text-red-600 font-medium">
                    - {formatINR(pay.deductions)}
                  </TableCell>

                  <TableCell className="font-mono font-extrabold text-emerald-700 text-sm">
                    {formatINR(pay.netSalary)}
                  </TableCell>

                  <TableCell>
                    {pay.status === 'PAID' ? (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        Paid ({pay.paidOn || 'Aug 01'})
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="bg-amber-100 text-amber-900 border-amber-200">
                        Processing
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPdf(pay.payPeriod)}
                      className="h-8 text-xs font-semibold"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF
                    </Button>
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
