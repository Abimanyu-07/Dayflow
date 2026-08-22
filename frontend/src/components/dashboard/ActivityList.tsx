import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { Clock, Calendar, User, ShieldCheck, Activity } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'attendance' | 'leave' | 'profile' | 'system';
}

interface ActivityListProps {
  activities?: ActivityItem[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities = [] }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return <Clock className="h-3.5 w-3.5 text-blue-600" />;
      case 'leave':
        return <Calendar className="h-3.5 w-3.5 text-emerald-600" />;
      case 'profile':
        return <User className="h-3.5 w-3.5 text-indigo-600" />;
      default:
        return <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />;
    }
  };

  const getBg = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return 'bg-blue-50 border-blue-100';
      case 'leave':
        return 'bg-emerald-50 border-emerald-100';
      case 'profile':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {activities.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Your recent check-ins, leave submissions, and updates will appear here."
          />
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((item) => (
              <div key={item.id} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${getBg(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>

                <div className="space-y-0.5 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <h5 className="font-bold text-slate-900">{item.title}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
