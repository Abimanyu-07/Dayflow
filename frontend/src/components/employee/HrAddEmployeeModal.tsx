import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeListItem, CreateEmployeePayload, employeeApi } from '@/services/employeeApi';
import { UserPlus, Edit, User } from 'lucide-react';
import { toast } from 'sonner';

interface HrAddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmployee?: EmployeeListItem | null;
  onSuccess: () => void;
}

export const HrAddEmployeeModal: React.FC<HrAddEmployeeModalProps> = ({
  isOpen,
  onClose,
  targetEmployee,
  onSuccess,
}) => {
  const isEditing = !!targetEmployee;

  const [fullName, setFullName] = useState(targetEmployee?.fullName || '');
  const [employeeId, setEmployeeId] = useState(targetEmployee?.employeeId || '');
  const [email, setEmail] = useState(targetEmployee?.email || '');
  const [phone, setPhone] = useState(targetEmployee?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(targetEmployee?.department || 'Engineering');
  const [jobTitle, setJobTitle] = useState(targetEmployee?.jobTitle || '');
  const [employmentStatus, setEmploymentStatus] = useState<EmployeeListItem['employmentStatus']>(
    targetEmployee?.employmentStatus || 'Active'
  );
  const [basicSalary, setBasicSalary] = useState(
    targetEmployee?.basicSalary ? targetEmployee.basicSalary.toString() : '55000'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!jobTitle.trim()) errs.jobTitle = 'Job title is required.';

    if (phone && !/^[+]?[0-9\s-]{8,18}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateEmployeePayload = {
        employeeId: employeeId.trim() || undefined,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department,
        jobTitle: jobTitle.trim(),
        employmentStatus,
        basicSalary: parseFloat(basicSalary) || 50000,
      };

      if (isEditing && targetEmployee) {
        await employeeApi.updateEmployee(targetEmployee.id, payload);
        toast.success(`Updated details for ${fullName}`);
      } else {
        const created = await employeeApi.addEmployee(payload);
        toast.success(`Employee ${created.fullName} (${created.employeeId}) onboarded successfully!`);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error('Unable to save employee details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              {isEditing ? <Edit className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            </div>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            {isEditing
              ? 'Modify staff information, department, job title, and salary.'
              : 'Onboard a new employee into the Dayflow workforce database.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Full Name & Employee ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="e.g. David Miller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9 text-xs"
              />
              {errors.fullName && <p className="text-[11px] text-red-600 font-medium">{errors.fullName}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="employeeId">Employee ID (Optional)</Label>
              <Input
                id="employeeId"
                placeholder="Auto-generated if empty"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-9 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="email">Work Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="david.m@dayflow.hr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs font-mono"
              />
              {errors.email && <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs font-mono"
              />
              {errors.phone && <p className="text-[11px] text-red-600 font-medium">{errors.phone}</p>}
            </div>
          </div>

          {/* Department & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs text-slate-900 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Senior Software Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="h-9 text-xs"
              />
              {errors.jobTitle && <p className="text-[11px] text-red-600 font-medium">{errors.jobTitle}</p>}
            </div>
          </div>

          {/* Status & Basic Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="status">Employment Status</Label>
              <select
                id="status"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value as EmployeeListItem['employmentStatus'])}
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs text-slate-900 bg-white font-semibold"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="basicSalary">Monthly Basic Salary (₹)</Label>
              <Input
                id="basicSalary"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving Employee..."
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-sm"
            >
              {isEditing ? 'Save Changes' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
