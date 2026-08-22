import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmployeeProfile } from '@/types/employee';
import { User, Mail, Phone, MapPin, BadgeCheck, Lock } from 'lucide-react';

interface PersonalInfoCardProps {
  profile: EmployeeProfile;
  isHrView?: boolean;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  profile,
  isHrView = false,
}) => {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Personal Information
          </CardTitle>
        </div>
        {!isHrView && (
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Lock className="h-3 w-3" /> Core IDs Read-only
          </span>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
          {/* Full Name */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
              Full Name
            </span>
            <span className="font-bold text-slate-900 block text-sm">
              {profile.fullName}
            </span>
          </div>

          {/* Employee ID */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
              Employee ID
            </span>
            <span className="font-mono font-bold text-blue-600 block text-sm">
              {profile.employeeId}
            </span>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-400" /> Email Address
            </span>
            <span className="font-mono text-slate-800 block">
              {profile.email}
            </span>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Phone className="h-3 w-3 text-slate-400" /> Phone Number
            </span>
            <span className="font-semibold text-slate-900 block font-mono">
              {profile.phone || '--'}
            </span>
          </div>

          {/* Address (Full width on sm grid) */}
          <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" /> Residential Address
            </span>
            <span className="text-slate-800 font-normal leading-relaxed block">
              {profile.address || 'No residential address recorded.'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
