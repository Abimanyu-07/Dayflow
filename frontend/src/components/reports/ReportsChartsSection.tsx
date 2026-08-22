import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AttendanceTrendPoint,
  DepartmentPayrollPoint,
  LeaveDistributionPoint,
} from '@/types/reports';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Building, PieChart as PieIcon } from 'lucide-react';

interface ReportsChartsSectionProps {
  trends: AttendanceTrendPoint[];
  departmentPayroll: DepartmentPayrollPoint[];
  leaveDistribution: LeaveDistributionPoint[];
}

export const ReportsChartsSection: React.FC<ReportsChartsSectionProps> = ({
  trends,
  departmentPayroll,
  leaveDistribution,
}) => {
  const formatINR = (val: number) => {
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Attendance Trends (AreaChart) - Spans 2 cols */}
      <Card className="lg:col-span-2 border-slate-200/80 shadow-xs">
        <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-bold text-slate-900">
              Workforce Attendance & Shift Trends
            </CardTitle>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            August 2026
          </span>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="present"
                  name="Present Staff"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#presentGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  name="Absent / Missing"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#absentGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Leave Types Distribution (PieChart) */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-slate-900">
              Leave Request Breakdown
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-2 flex flex-col items-center">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leaveDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legends */}
          <div className="grid grid-cols-2 gap-2 w-full pt-1 text-xs">
            {leaveDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-slate-600">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate font-medium">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Department Payroll & Staff Count (BarChart) - Spans 3 cols */}
      <Card className="lg:col-span-3 border-slate-200/80 shadow-xs">
        <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-600" />
            <CardTitle className="text-sm font-bold text-slate-900">
              Departmental Payroll & Staff Distribution
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPayroll} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={formatINR}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'Net Payroll (₹)' ? `₹${Number(val).toLocaleString('en-IN')}` : val,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="netPayroll"
                  name="Net Payroll (₹)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  yAxisId="right"
                  dataKey="employeeCount"
                  name="Headcount"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
