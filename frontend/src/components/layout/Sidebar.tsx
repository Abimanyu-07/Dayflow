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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isHr = user?.role === 'HR';

  const handleLogout = async () => {
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
    <aside
      className={cn(
        'hidden lg:flex flex-col justify-between h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 sticky top-0 z-40',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header Logo */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Layers className="h-5 w-5 stroke-[2.2]" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-lg font-black tracking-tight text-white block leading-none">
                  Dayflow
                </span>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  {isHr ? 'HR Administration' : 'Employee Portal'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Main Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Logout section */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="truncate text-xs">
              <span className="font-bold text-slate-100 block truncate">{user?.fullName || 'User'}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                {user?.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer',
            isCollapsed && 'py-2.5'
          )}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
