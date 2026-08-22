import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAccessToken } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, ShieldCheck, LogOut, Users, FileSpreadsheet, Building2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentToken = getAccessToken();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out of HR Admin Portal');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
                Dayflow
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                HR Admin Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="default" className="bg-indigo-600 hover:bg-indigo-700 hidden sm:inline-flex gap-1.5 py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>HR ADMIN ROLE</span>
            </Badge>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 gap-1.5 text-xs font-semibold"
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
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" /> HR Administration Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome, {user?.fullName || 'HR Manager'}!
            </h1>
            <p className="text-sm text-slate-500">
              Admin ID: <span className="font-mono font-bold text-slate-800">{user?.employeeId || 'HR001'}</span> &bull; {user?.email || 'hr@dayflow.com'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 px-4">
              <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Manage Employees
            </Button>
          </div>
        </div>

        {/* Security Session Banner */}
        <div className="bg-slate-950 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Authenticated HR Access Token (In-Memory)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Cookie: HTTP-Only Refresh Token Active</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 break-all">
            {currentToken ? `Bearer ${currentToken}` : 'No active access token in memory'}
          </div>
        </div>

        {/* HR Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Employee Directory</h3>
            <p className="text-xs text-slate-500">Add, edit, and manage company staff records and roles.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Leave Approvals</h3>
            <p className="text-xs text-slate-500">Review pending employee leave requests and time off.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Payroll Runs</h3>
            <p className="text-xs text-slate-500">Generate monthly payroll, tax calculations & disbursements.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
