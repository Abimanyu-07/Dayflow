import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmployeeTable } from '@/components/dashboard/EmployeeTable';
import { EmployeeCardGrid } from '@/components/employee/EmployeeCardGrid';
import { HrAddEmployeeModal } from '@/components/employee/HrAddEmployeeModal';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { employeeApi, EmployeeListItem } from '@/services/employeeApi';
import {
  Users,
  Building,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Plus,
} from 'lucide-react';

export const AdminEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'empId'>('name');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeListItem | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await employeeApi.getEmployees({
        search: searchTerm,
        department: departmentFilter,
        status: statusFilter,
        sortBy,
      });
      setEmployees(res.data);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, departmentFilter, statusFilter, sortBy]);

  const handleEditClick = (emp: EmployeeListItem) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => (e.employmentStatus || 'Active') === 'Active').length;
  const deptsCount = new Set(employees.map((e) => e.department)).size;

  return (
    <AppLayout title="Workforce Employee Directory">
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={fetchEmployees} title="Unable to load employee directory" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner & Primary Add Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Employee Directory
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Manage organization staff profiles, departments, roles, and onboarding.
              </p>
            </div>

            <Button
              onClick={handleAddClick}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-10 px-4 shadow-sm self-start sm:self-center"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add New Employee
            </Button>
          </div>

          {/* 4 Summary Stat Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Staff"
              value={totalEmployees}
              subtitle="Registered workforce headcount"
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-slate-100 text-slate-800 border-slate-200"
              badgeText="Directory"
              badgeVariant="secondary"
            />

            <StatCard
              title="Departments"
              value={deptsCount}
              subtitle="Active functional divisions"
              icon={<Building className="h-5 w-5" />}
              iconBgColor="bg-blue-50 text-blue-600 border-blue-200"
              badgeText="Divisions"
              badgeVariant="secondary"
            />

            <StatCard
              title="Active Staff Rate"
              value={`${Math.round((activeCount / (totalEmployees || 1)) * 100)}%`}
              subtitle={`${activeCount} active full-time members`}
              icon={<UserCheck className="h-5 w-5" />}
              iconBgColor="bg-emerald-50 text-emerald-600 border-emerald-200"
              badgeText="Active"
              badgeVariant="success"
            />

            <StatCard
              title="New Onboardings"
              value="+2"
              subtitle="Joined in current quarter"
              icon={<UserPlus className="h-5 w-5" />}
              iconBgColor="bg-indigo-50 text-indigo-600 border-indigo-200"
              badgeText="Growth"
              badgeVariant="secondary"
            />
          </div>

          {/* Search, Department, Status & View Mode Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-500 ml-1" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="ALL">All Depts</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="PRODUCT">Product</option>
                  <option value="DESIGN">Design</option>
                  <option value="HUMAN RESOURCES">HR</option>
                  <option value="FINANCE">Finance</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer px-1"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON LEAVE">On Leave</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60 text-xs hidden md:flex">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'empId')}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer px-1"
                >
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="empId">Sort: Employee ID</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle Buttons (Table vs Grid Cards) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <TableIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>

          {/* Directory Content (Table or Grid View) */}
          {viewMode === 'table' ? (
            <EmployeeTable employees={employees} />
          ) : (
            <EmployeeCardGrid employees={employees} onEditClick={handleEditClick} />
          )}

          {/* Add / Edit Employee Modal Dialog */}
          {isModalOpen && (
            <HrAddEmployeeModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingEmployee(null);
              }}
              targetEmployee={editingEmployee}
              onSuccess={fetchEmployees}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default AdminEmployeesPage;
