import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Users } from 'lucide-react';

interface HrAttendanceChartProps {
  distribution?: {
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
  };
}

export const HrAttendanceChart: React.FC<HrAttendanceChartProps> = ({
  distribution = { present: 34, absent: 2, halfDay: 1, leave: 5 },
}) => {
  const chartData = [
    { name: 'Present', count: distribution.present, color: '#16a34a' },
    { name: 'Absent', count: distribution.absent, color: '#dc2626' },
    { name: 'Half-day', count: distribution.halfDay, color: '#d97706' },
    { name: 'Leave', count: distribution.leave, color: '#2563eb' },
  ];

  const total = distribution.present + distribution.absent + distribution.halfDay + distribution.leave;

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Workforce Attendance Overview
          </CardTitle>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total Logged: <strong className="text-slate-900">{total}</strong>
        </span>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Recharts Bar Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
            <span className="font-medium text-emerald-900">Present</span>
            <span className="font-extrabold text-emerald-700">{distribution.present}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/60 border border-red-100">
            <span className="font-medium text-red-900">Absent</span>
            <span className="font-extrabold text-red-700">{distribution.absent}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-100">
            <span className="font-medium text-amber-900">Half-day</span>
            <span className="font-extrabold text-amber-700">{distribution.halfDay}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
            <span className="font-medium text-blue-900">On Leave</span>
            <span className="font-extrabold text-blue-700">{distribution.leave}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
