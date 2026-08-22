import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SalaryStructure } from '@/types/employee';
import { CreditCard, IndianRupee, Lock, ShieldAlert } from 'lucide-react';

interface SalaryCardProps {
  salary: SalaryStructure;
  isHrView?: boolean;
}

export const SalaryCard: React.FC<SalaryCardProps> = ({ salary, isHrView = false }) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Salary Structure
          </CardTitle>
        </div>
        {!isHrView ? (
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Lock className="h-3 w-3" /> Confidential & Read-only
          </span>
        ) : (
          <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            HR Editable
          </span>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Basic Salary</span>
            <span className="font-mono font-bold text-slate-900">
              {formatINR(salary.basicSalary)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Allowances (HRA, TA, Special)</span>
            <span className="font-mono font-bold text-emerald-700">
              + {formatINR(salary.allowances)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Deductions (PF, ESI, Tax)</span>
            <span className="font-mono font-bold text-red-600">
              - {formatINR(salary.deductions)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 text-sm font-extrabold bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-slate-900 flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-emerald-600" /> Net Monthly Take-Home
            </span>
            <span className="font-mono text-emerald-700 text-base">
              {formatINR(salary.netSalary)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
