import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'destructive' | 'warning' | 'secondary';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-slate-100 text-slate-800',
  badgeText,
  badgeVariant = 'secondary',
  className,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <Card className={cn('border-slate-200/80 shadow-xs hover:shadow-md transition-all', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/60', iconBgColor)}>
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {badgeText && (
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
                badgeStyles[badgeVariant]
              )}
            >
              {badgeText}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 font-normal">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
