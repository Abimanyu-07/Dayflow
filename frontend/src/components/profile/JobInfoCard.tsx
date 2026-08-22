import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmployeeProfile } from '@/types/employee';
import { Briefcase, Building, Calendar, UserCheck, Shield } from 'lucide-react';

interface JobInfoCardProps {
  profile: EmployeeProfile;
}

export const JobInfoCard: React.FC<JobInfoCardProps> = ({ profile }) => {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Job Information
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
          {/* Job Title */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
              Job Title
            </span>
            <span className="font-bold text-slate-900 block text-sm">
              {profile.jobTitle}
            </span>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Building className="h-3 w-3 text-slate-400" /> Department
            </span>
            <span className="font-semibold text-slate-800 block">
              {profile.department}
            </span>
          </div>

          {/* Joining Date */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" /> Date of Joining
            </span>
            <span className="font-mono text-slate-800 block font-medium">
              {profile.joiningDate}
            </span>
          </div>

          {/* Employment Status */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-slate-400" /> Status
            </span>
            <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-bold border-emerald-200">
              {profile.employmentStatus}
            </Badge>
          </div>

          {/* Reporting Manager */}
          {profile.reportingManager && (
            <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-100">
              <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
                <Shield className="h-3 w-3 text-slate-400" /> Reporting Manager
              </span>
              <span className="font-semibold text-slate-900 block">
                {profile.reportingManager}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
