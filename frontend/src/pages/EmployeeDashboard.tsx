import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAccessToken } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, User, LogOut, ShieldCheck, CheckCircle, Clock, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentToken = getAccessToken();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
                Dayflow
              </span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                Employee Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="success" className="hidden sm:inline-flex gap-1.5 py-1 px-3">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>EMPLOYEE ROLE</span>
            </Badge>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 gap-1.5 text-xs font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <User className="h-3.5 w-3.5" /> Employee Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.fullName || 'Employee'}!
            </h1>
            <p className="text-sm text-slate-500">
              Employee ID: <span className="font-mono font-bold text-slate-800">{user?.employeeId || 'EMP1042'}</span> &bull; {user?.email || 'employee@dayflow.hr'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-4">
              <Clock className="mr-1.5 h-3.5 w-3.5" /> Check In Now
            </Button>
          </div>
        </div>

        {/* JWT & Session Security Status Banner */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>In-Memory JWT Access Token Status</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Cookie: HTTP-only Refresh Token Active</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 break-all">
            {currentToken ? `Bearer ${currentToken}` : 'No active access token in memory'}
          </div>
          <p className="text-[11px] text-slate-400">
            &bull; Access token is strictly held in JS memory (closure/variable). Refresh token is persisted via secure HTTP-only cookie.
          </p>
        </div>

        {/* Quick Action Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Attendance & Shifts</h3>
            <p className="text-xs text-slate-500">Track check-ins, overtime, and monthly attendance logs.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Leave Applications</h3>
            <p className="text-xs text-slate-500">Request paid leave, sick days, and view approval status.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Payslips & Tax</h3>
            <p className="text-xs text-slate-500">Download monthly pay statements and tax tax summaries.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
