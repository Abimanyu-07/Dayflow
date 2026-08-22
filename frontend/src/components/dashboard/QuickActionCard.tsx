import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  iconBg?: string;
  badge?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  to,
  iconBg = 'bg-blue-50 text-blue-600',
  badge,
}) => {
  return (
    <Link to={to} className="block group">
      <Card className="border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 h-full">
        <CardContent className="p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/50 group-hover:scale-105 transition-transform', iconBg)}>
              {icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {title}
                </h4>
                {badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0 mt-0.5">
            <ChevronRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
