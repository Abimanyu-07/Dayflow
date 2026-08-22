import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { EmployeeListItem } from '@/services/employeeApi';
import { Search, Filter, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeTableProps {
  employees?: EmployeeListItem[];
  onSearchChange?: (q: string) => void;
  onDepartmentChange?: (dept: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === 'ALL' ||
      emp.department.toUpperCase() === departmentFilter.toUpperCase();

    return matchesSearch && matchesDept;
  });

  const getStatusBadge = (status: EmployeeListItem['attendanceStatus']) => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200">Present</Badge>;
      case 'ABSENT':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Absent</Badge>;
      case 'HALF_DAY':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Half-day</Badge>;
      case 'LEAVE':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-900 border-blue-200">On Leave</Badge>;
      default:
        return <Badge variant="outline">--</Badge>;
    }
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Workforce Employee Preview
          </CardTitle>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200/60">
            <Filter className="h-3.5 w-3.5 text-slate-500 ml-1" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL">All Depts</option>
              <option value="ENGINEERING">Engineering</option>
              <option value="PRODUCT">Product</option>
              <option value="DESIGN">Design</option>
              <option value="HUMAN RESOURCES">HR</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No matching employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono font-bold text-slate-900">
                    {emp.employeeId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-bold text-slate-900 block">{emp.fullName}</span>
                      <span className="text-[11px] text-slate-400">{emp.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {emp.department}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {emp.jobTitle}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(emp.attendanceStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.info(`Viewing profile for ${emp.fullName} (${emp.employeeId})`)}
                      className="h-8 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
