import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmployeeProfile } from '@/types/employee';
import { Camera, Edit, ShieldCheck, Building2, Briefcase } from 'lucide-react';

interface ProfileHeaderProps {
  profile: EmployeeProfile;
  isHrView?: boolean;
  onEditClick: () => void;
  onChangePhotoClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isHrView = false,
  onEditClick,
  onChangePhotoClick,
}) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
      {/* Subtle top banner background accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pt-2">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar with Camera Overlay Trigger */}
          <div className="relative group">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-md ring-2 ring-slate-100">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="bg-slate-900 text-white font-extrabold text-2xl sm:text-3xl">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={onChangePhotoClick}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110 cursor-pointer"
              title="Change Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Basic Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {profile.fullName}
              </h1>
              <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-bold border-emerald-200">
                ● {profile.employmentStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold text-slate-500">
              <span className="bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80 text-slate-800">
                {profile.employeeId}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                {profile.jobTitle}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {profile.department}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="self-stretch sm:self-auto flex flex-col justify-end">
          <Button
            onClick={onEditClick}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-10 px-5 shadow-sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            {isHrView ? 'Edit Employee Details' : 'Edit Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};
