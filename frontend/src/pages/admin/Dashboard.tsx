import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { HrAttendanceChart } from '@/components/dashboard/HrAttendanceChart';
import { EmployeeTable } from '@/components/dashboard/EmployeeTable';
import { LeaveRequestTable } from '@/components/dashboard/LeaveRequestTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { dashboardApi, AdminDashboardData } from '@/services/dashboardApi';
import { employeeApi, EmployeeListItem } from '@/services/employeeApi';
import { leaveApi, LeaveRequest } from '@/services/leaveApi';
import { HrAddEmployeeModal } from '@/components/employee/HrAddEmployeeModal';
import {
  Users,
  UserCheck,
  Calendar,
  AlertCircle,
  Plus,
  Clock,
  CalendarCheck,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [dashRes, empRes, leaveRes] = await Promise.all([
        dashboardApi.getAdminDashboard(),
        employeeApi.getEmployees(),
        leaveApi.getAllLeaves(),
      ]);
      setData(dashRes);
      setEmployees(empRes.data);
      setLeaves(leaveRes);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;

  return (
    <AppLayout title="HR Administration Dashboard">
      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={fetchAdminData} />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner & HR Quick Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.fullName || 'HR Manager'} 👋
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Logged in as <span className="font-semibold text-slate-800">{user?.email || 'hr@dayflow.com'}</span> &bull; HR Admin ID: <span className="font-mono font-bold text-slate-800">{user?.employeeId || 'HR001'}</span>
              </p>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setIsAddEmployeeModalOpen(true)}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-xs"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Employee
              </Button>

              <Button
                onClick={() => navigate('/admin/employees')}
                size="sm"
                variant="outline"
                className="h-9 text-xs font-semibold"
              >
                <Users className="mr-1.5 h-3.5 w-3.5" /> View Employees
              </Button>

              <Button
                onClick={() => navigate('/admin/attendance')}
                size="sm"
                variant="outline"
                className="h-9 text-xs font-semibold hidden sm:inline-flex"
              >
                <Clock className="mr-1.5 h-3.5 w-3.5" /> Attendance
              </Button>

              <Button
                onClick={() => navigate('/admin/leaves')}
                size="sm"
                variant="outline"
                className="h-9 text-xs font-semibold hidden md:inline-flex"
              >
                <CalendarCheck className="mr-1.5 h-3.5 w-3.5" /> Leave Approvals
              </Button>

              <Button
                onClick={() => navigate('/admin/payroll')}
                size="sm"
                variant="outline"
                className="h-9 text-xs font-semibold hidden lg:inline-flex"
              >
                <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Payroll
              </Button>

              <Button
                onClick={() => navigate('/admin/reports')}
                size="sm"
                variant="outline"
                className="h-9 text-xs font-semibold hidden xl:inline-flex"
              >
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> Reports
              </Button>
            </div>
          </div>

          {/* 4 Organization Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Employees"
              value={data.totalEmployees}
              subtitle="Active staff across all departments"
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-slate-100 text-slate-800 border-slate-200"
              badgeText="Directory"
              badgeVariant="secondary"
            />

            <StatCard
              title="Present Today"
              value={data.presentToday}
              subtitle={`Out of ${data.totalEmployees} total staff`}
              icon={<UserCheck className="h-5 w-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
              badgeText={`${Math.round((data.presentToday / data.totalEmployees) * 100)}% Rate`}
              badgeVariant="success"
            />

            <StatCard
              title="On Leave Today"
              value={data.onLeaveToday}
              subtitle="Approved medical & annual leave"
              icon={<Calendar className="h-5 w-5" />}
              iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
              badgeText="On Leave"
              badgeVariant="secondary"
            />

            <StatCard
              title="Pending Leave Requests"
              value={pendingCount}
              subtitle="Awaiting HR approval or review"
              icon={<AlertCircle className="h-5 w-5" />}
              iconBgColor="bg-amber-50 text-amber-600 border-amber-200"
              badgeText={pendingCount > 0 ? 'Requires Action' : 'Cleared'}
              badgeVariant={pendingCount > 0 ? 'warning' : 'success'}
            />
          </div>

          {/* HR Attendance Overview Chart Section */}
          <HrAttendanceChart distribution={data.attendanceDistribution} />

          {/* Employee Directory Preview Table */}
          <EmployeeTable employees={employees} />

          {/* Pending Leave Approvals Section */}
          <LeaveRequestTable
            initialRequests={leaves}
            onActionComplete={fetchAdminData}
          />

          {/* Add Employee Modal */}
          {isAddEmployeeModalOpen && (
            <HrAddEmployeeModal
              isOpen={isAddEmployeeModalOpen}
              onClose={() => setIsAddEmployeeModalOpen(false)}
              onSuccess={fetchAdminData}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default AdminDashboardPage;
