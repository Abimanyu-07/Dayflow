import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceCard } from '@/components/dashboard/AttendanceCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { ActivityList } from '@/components/dashboard/ActivityList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { dashboardApi, EmployeeDashboardData } from '@/services/dashboardApi';
import { attendanceApi, AttendanceRecord } from '@/services/attendanceApi';
import { Clock, Calendar, AlertCircle, Briefcase, User, CreditCard, ExternalLink, Mail, Building, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [dashRes, attRes] = await Promise.all([
        dashboardApi.getEmployeeDashboard(),
        attendanceApi.getTodayAttendance(),
      ]);
      setData(dashRes);
      setTodayAttendance(attRes);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const employeeName = user?.fullName || data?.profilePreview.fullName || 'Employee';

  return (
    <AppLayout title="Employee Dashboard">
      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={fetchDashboardData} />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Good morning, {employeeName} 👋
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Here's what's happening with your workday.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                ID: {user?.employeeId || data.profilePreview.employeeId}
              </span>
            </div>
          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Attendance Status"
              value={todayAttendance?.status === 'PRESENT' ? 'Present' : 'Not Checked In'}
              subtitle={todayAttendance?.checkInTime ? `Checked in ${todayAttendance.checkInTime}` : 'Check in to start shift'}
              icon={<Clock className="h-5 w-5" />}
              iconBgColor={todayAttendance?.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
              badgeText={todayAttendance?.status === 'PRESENT' ? 'Checked In' : 'Pending'}
              badgeVariant={todayAttendance?.status === 'PRESENT' ? 'success' : 'warning'}
            />

            <StatCard
              title="Leave Balance"
              value={`${data.leaveBalance} Days`}
              subtitle="Available paid annual leave"
              icon={<Calendar className="h-5 w-5" />}
              iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
              badgeText="Active"
              badgeVariant="secondary"
            />

            <StatCard
              title="Pending Requests"
              value={data.pendingRequestsCount}
              subtitle="Leave submissions awaiting HR approval"
              icon={<AlertCircle className="h-5 w-5" />}
              iconBgColor="bg-indigo-50 text-indigo-600 border-indigo-200"
              badgeText={data.pendingRequestsCount > 0 ? 'Awaiting HR' : 'Clear'}
              badgeVariant={data.pendingRequestsCount > 0 ? 'warning' : 'secondary'}
            />

            <StatCard
              title="Work Status"
              value={
                todayAttendance?.checkOutTime
                  ? 'Completed'
                  : todayAttendance?.status === 'PRESENT'
                  ? 'Working'
                  : 'Not Started'
              }
              subtitle={todayAttendance?.workingDuration ? `Shift time: ${todayAttendance.workingDuration}` : 'Daily shift schedule'}
              icon={<Briefcase className="h-5 w-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
              badgeText="Today"
              badgeVariant="success"
            />
          </div>

          {/* Prominent Today's Attendance Card + Quick Access Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 xl:col-span-5">
              <AttendanceCard
                initialAttendance={todayAttendance || undefined}
                onAttendanceUpdate={(updated) => {
                  setTodayAttendance(updated);
                  fetchDashboardData();
                }}
              />
            </div>

            {/* Quick Access Cards */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Quick Access
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QuickActionCard
                  title="Profile"
                  description="View and update your personal information and documents."
                  icon={<User className="h-5 w-5" />}
                  to="/employee/profile"
                  iconBg="bg-indigo-50 text-indigo-600"
                />

                <QuickActionCard
                  title="Attendance"
                  description="View your daily and weekly attendance records."
                  icon={<Clock className="h-5 w-5" />}
                  to="/employee/attendance"
                  iconBg="bg-emerald-50 text-emerald-600"
                />

                <QuickActionCard
                  title="Leave Requests"
                  description="Apply for leave and track approval statuses."
                  icon={<Calendar className="h-5 w-5" />}
                  to="/employee/leave"
                  iconBg="bg-blue-50 text-blue-600"
                  badge={`${data.leaveBalance}d left`}
                />

                <QuickActionCard
                  title="Payroll"
                  description="View your salary statements and tax information."
                  icon={<CreditCard className="h-5 w-5" />}
                  to="/employee/payroll"
                  iconBg="bg-amber-50 text-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recent Activity Timeline & Compact Profile Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Recent Activity List */}
            <div className="lg:col-span-7 xl:col-span-8">
              <ActivityList activities={data.recentActivities} />
            </div>

            {/* Compact Profile Preview Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>Employee Profile</span>
                    <span className="text-xs font-mono font-normal text-slate-400">
                      {user?.employeeId || data.profilePreview.employeeId}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarFallback className="bg-slate-900 text-white font-bold text-sm">
                        {employeeName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{employeeName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{data.profilePreview.jobTitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Building className="h-3.5 w-3.5 text-slate-400" /> Department
                      </span>
                      <span className="font-semibold text-slate-900">{data.profilePreview.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                      </span>
                      <span className="font-mono text-slate-800">{user?.email || data.profilePreview.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Award className="h-3.5 w-3.5 text-slate-400" /> Status
                      </span>
                      <span className="font-bold text-emerald-700">Verified Full-Time</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/employee/profile')}
                    variant="outline"
                    className="w-full h-10 text-xs font-semibold border-slate-200 hover:bg-slate-50 mt-1"
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Full Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeDashboardPage;
