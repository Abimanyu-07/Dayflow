import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, User, ShieldCheck, LogOut, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TopbarProps {
  title?: string;
  onOpenMobileNav: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title = 'Dashboard',
  onOpenMobileNav,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [hasUnread, setHasUnread] = useState(true);

  const isHr = user?.role === 'HR';

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'DF';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
          <div className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
            Dayflow &bull; {isHr ? 'HR Workspace' : 'Employee Workspace'}
          </div>
        </div>
      </div>

      {/* Right: Notifications, Role Badge & User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2 space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              {hasUnread && (
                <button
                  onClick={() => setHasUnread(false)}
                  className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-1 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Attendance Logged</span>
                  <span className="text-[10px] text-slate-400 font-mono">Today</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Your daily attendance check-in status was recorded.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>System Update</span>
                  <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dayflow HRMS Security & Module Update installed.
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Badge */}
        <Badge
          variant={isHr ? 'default' : 'secondary'}
          className={isHr ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold hidden sm:inline-flex' : 'bg-slate-100 text-slate-800 font-bold hidden sm:inline-flex'}
        >
          {isHr ? 'HR ADMIN' : 'EMPLOYEE'}
        </Badge>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full outline-none cursor-pointer group">
              <Avatar className="h-9 w-9 border border-slate-200 shadow-2xs group-hover:border-slate-400 transition-colors">
                <AvatarFallback className="bg-slate-900 text-white font-extrabold text-xs">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.fullName || 'User'}</p>
                <p className="text-[11px] font-mono text-slate-500 leading-none">{user?.email}</p>
                <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  ID: {user?.employeeId || 'EMP001'}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(isHr ? '/admin/dashboard' : '/employee/profile')}>
              <User className="mr-2 h-3.5 w-3.5" />
              <span>{isHr ? 'HR Dashboard' : 'My Profile'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
