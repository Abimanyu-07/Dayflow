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
import { EmployeeProfile, UpdateProfilePayload } from '@/types/employee';
import { profileApi } from '@/services/profileApi';
import { Edit, User, Briefcase, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployeeProfile;
  isHrView?: boolean;
  onSuccess: (updated: EmployeeProfile) => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  isOpen,
  onClose,
  profile,
  isHrView = false,
  onSuccess,
}) => {
  // Form Field States
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');

  // HR specific fields
  const [department, setDepartment] = useState(profile.department);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [employmentStatus, setEmploymentStatus] = useState<EmployeeProfile['employmentStatus']>(
    profile.employmentStatus
  );

  // Salary fields for HR
  const [basicSalary, setBasicSalary] = useState(profile.salary.basicSalary.toString());
  const [allowances, setAllowances] = useState(profile.salary.allowances.toString());
  const [deductions, setDeductions] = useState(profile.salary.deductions.toString());

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // Phone validation
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[+]?[0-9\s-]{8,18}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number.';
    }

    // Address validation
    if (!address.trim()) {
      errs.address = 'Address is required.';
    }

    // HR Mode Validations
    if (isHrView) {
      if (!fullName.trim()) {
        errs.fullName = 'Full Name is required.';
      }

      if (!email.trim()) {
        errs.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }

      if (!jobTitle.trim()) {
        errs.jobTitle = 'Job title is required.';
      }

      const basicNum = parseFloat(basicSalary);
      if (isNaN(basicNum) || basicNum < 0) {
        errs.basicSalary = 'Basic salary must be a valid positive number.';
      }

      const allowNum = parseFloat(allowances);
      if (isNaN(allowNum) || allowNum < 0) {
        errs.allowances = 'Allowances must be a valid positive number.';
      }

      const dedNum = parseFloat(deductions);
      if (isNaN(dedNum) || dedNum < 0) {
        errs.deductions = 'Deductions must be a valid positive number.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: UpdateProfilePayload = isHrView
        ? {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            department: department.trim(),
            jobTitle: jobTitle.trim(),
            employmentStatus,
            salary: {
              basicSalary: parseFloat(basicSalary),
              allowances: parseFloat(allowances),
              deductions: parseFloat(deductions),
            },
          }
        : {
            phone: phone.trim(),
            address: address.trim(),
          };

      const updated = isHrView
        ? await profileApi.updateEmployeeProfile(profile.employeeId, payload)
        : await profileApi.updateMyProfile(payload);

      toast.success('Profile updated successfully');
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      toast.error('Unable to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
              <Edit className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              {isHrView ? 'Edit Employee Profile (HR)' : 'Edit Personal Profile'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-1">
            {isHrView
              ? 'Update personal details, job title, department, and salary for this employee.'
              : 'Update your phone number and address. Employee ID and email are read-only.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-3">
          {/* Section 1: Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <User className="h-3.5 w-3.5 text-blue-600" /> Personal Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                {isHrView ? (
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 text-xs"
                  />
                ) : (
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    disabled
                    className="h-9 text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                )}
                {errors.fullName && <p className="text-[11px] text-red-600 font-medium">{errors.fullName}</p>}
              </div>

              {/* Employee ID (Always Read-only) */}
              <div className="space-y-1">
                <Label htmlFor="empId">Employee ID</Label>
                <Input
                  id="empId"
                  value={profile.employeeId}
                  disabled
                  className="h-9 text-xs font-mono font-bold bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                {isHrView ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                ) : (
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="h-9 text-xs font-mono bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                )}
                {errors.email && <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>}
              </div>

              {/* Phone (Editable by both) */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
                {errors.phone && <p className="text-[11px] text-red-600 font-medium">{errors.phone}</p>}
              </div>

              {/* Address (Editable by both) */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="address">Residential Address *</Label>
                <textarea
                  id="address"
                  rows={2}
                  placeholder="Street, City, State, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {errors.address && <p className="text-[11px] text-red-600 font-medium">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: HR Specific Job Information */}
          {isHrView && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                <Briefcase className="h-3.5 w-3.5 text-indigo-600" /> Job Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="h-9 text-xs"
                  />
                  {errors.jobTitle && <p className="text-[11px] text-red-600 font-medium">{errors.jobTitle}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
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

                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <select
                    id="employmentStatus"
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as EmployeeProfile['employmentStatus'])}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs text-slate-900 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: HR Specific Salary Structure */}
          {isHrView && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Salary Structure (INR)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="basicSalary">Basic Salary (₹)</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                  {errors.basicSalary && <p className="text-[11px] text-red-600 font-medium">{errors.basicSalary}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="allowances">Allowances (₹)</Label>
                  <Input
                    id="allowances"
                    type="number"
                    value={allowances}
                    onChange={(e) => setAllowances(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                  {errors.allowances && <p className="text-[11px] text-red-600 font-medium">{errors.allowances}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="deductions">Deductions (₹)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                  {errors.deductions && <p className="text-[11px] text-red-600 font-medium">{errors.deductions}</p>}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving..."
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-sm"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
