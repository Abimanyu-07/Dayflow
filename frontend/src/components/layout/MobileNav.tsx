import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Layers,
  LayoutDashboard,
  User,
  Clock,
  Calendar,
  CreditCard,
  Users,
  CalendarCheck,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isHr = user?.role === 'HR';

  const handleLogout = async () => {
    onClose();
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const navItems = isHr
    ? [
        { label: 'HR Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Employees', to: '/admin/employees', icon: Users },
        { label: 'Attendance', to: '/admin/attendance', icon: Clock },
        { label: 'Leave Approvals', to: '/admin/leaves', icon: CalendarCheck },
        { label: 'Payroll', to: '/admin/payroll', icon: CreditCard },
        { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
      ]
    : [
        { label: 'Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
        { label: 'Profile', to: '/employee/profile', icon: User },
        { label: 'Attendance', to: '/employee/attendance', icon: Clock },
        { label: 'Leave Requests', to: '/employee/leave', icon: Calendar },
        { label: 'Payroll', to: '/employee/payroll', icon: CreditCard },
      ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in-0"
      />

      {/* Drawer Content */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-100 shadow-2xl flex flex-col justify-between p-4 z-50 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-none">
                  Dayflow
                </span>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  {isHr ? 'HR Administration' : 'Employee Portal'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="py-4 space-y-1.5">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User & Logout */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="font-bold text-xs text-white block">{user?.fullName || 'User'}</span>
            <span className="text-[11px] font-mono text-slate-400 block">{user?.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
