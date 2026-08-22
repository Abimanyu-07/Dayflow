import React from 'react';
import { UserRole } from '@/services/authApi';
import { SegmentedControl, Option } from '@/components/ui/segmented-control';
import { User, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => {
  const options: Option<UserRole>[] = [
    {
      label: 'Employee',
      value: 'EMPLOYEE',
      icon: <User className="h-4 w-4" />,
    },
    {
      label: 'HR / Admin',
      value: 'HR',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-1.5">
      <SegmentedControl options={options} value={value} onChange={onChange} />
    </div>
  );
};
