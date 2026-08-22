import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmployeeListItem } from '@/services/employeeApi';
import { EmptyState } from '@/components/common/EmptyState';
import { Mail, Phone, Building, Briefcase, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmployeeCardGridProps {
  employees: EmployeeListItem[];
  onEditClick: (emp: EmployeeListItem) => void;
}

export const EmployeeCardGrid: React.FC<EmployeeCardGridProps> = ({
  employees,
  onEditClick,
}) => {
  const navigate = useNavigate();

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="No staff members matched your active search or filter parameters."
      />
    );
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((emp) => (
        <Card
          key={emp.id}
          className="border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
        >
          <CardContent className="p-5 space-y-4">
            {/* Top Avatar & Name Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-slate-200 shrink-0">
                  <AvatarImage src={emp.avatarUrl} alt={emp.fullName} />
                  <AvatarFallback className="bg-slate-900 text-white font-bold text-sm">
                    {getInitials(emp.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {emp.fullName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{emp.jobTitle}</p>
                </div>
              </div>

              <Badge
                variant={emp.employmentStatus === 'Active' ? 'success' : 'outline'}
                className="shrink-0"
              >
                {emp.employmentStatus || 'Active'}
              </Badge>
            </div>

            {/* Employee ID & Department Details */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  Employee ID
                </span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {emp.employeeId}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Building className="h-3 w-3 text-slate-400" /> Department
                </span>
                <span className="font-semibold text-slate-800">{emp.department}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Mail className="h-3 w-3 text-slate-400" /> Email
                </span>
                <span className="font-mono text-slate-700 truncate max-w-[150px]">
                  {emp.email}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <Button
                onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
                size="sm"
                variant="outline"
                className="w-full h-8 text-xs font-semibold"
              >
                <Eye className="mr-1 h-3.5 w-3.5" /> View Profile
              </Button>

              <Button
                onClick={() => onEditClick(emp)}
                size="sm"
                variant="ghost"
                className="h-8 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
