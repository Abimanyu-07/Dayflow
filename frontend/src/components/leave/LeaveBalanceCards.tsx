import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeaveBalance } from '@/types/leave';
import { Calendar, Stethoscope, Coffee, Briefcase } from 'lucide-react';

interface LeaveBalanceCardsProps {
  balance: LeaveBalance;
}

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({ balance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Annual Leave"
        value={`${balance.annualRemaining} Days`}
        subtitle={`Remaining out of ${balance.annualTotal} days allowance`}
        icon={<Calendar className="h-5 w-5" />}
        iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
        badgeText="Paid Leave"
        badgeVariant="success"
      />

      <StatCard
        title="Sick Leave"
        value={`${balance.sickRemaining} Days`}
        subtitle={`Remaining out of ${balance.sickTotal} medical days`}
        icon={<Stethoscope className="h-5 w-5" />}
        iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
        badgeText="Medical"
        badgeVariant="secondary"
      />

      <StatCard
        title="Casual Leave"
        value={`${balance.casualRemaining} Days`}
        subtitle={`Remaining out of ${balance.casualTotal} short notice days`}
        icon={<Coffee className="h-5 w-5" />}
        iconBgColor="bg-amber-50 text-amber-600 border-amber-200"
        badgeText="Casual"
        badgeVariant="warning"
      />

      <StatCard
        title="Total Available"
        value={`${balance.annualRemaining + balance.sickRemaining + balance.casualRemaining} Days`}
        subtitle="Combined available leave balance"
        icon={<Briefcase className="h-5 w-5" />}
        iconBgColor="bg-indigo-50 text-indigo-600 border-indigo-200"
        badgeText="Active"
        badgeVariant="secondary"
      />
    </div>
  );
};
