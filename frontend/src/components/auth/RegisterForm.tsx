import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/services/authApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RoleSelector } from './RoleSelector';
import { PasswordStrength, evaluatePassword } from './PasswordStrength';
import { PolicyModal } from './PolicyModals';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRules = evaluatePassword(password);
  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;

  // Role-based ID prefix validation
  const validateEmployeeId = (id: string, selectedRole: UserRole): { isValid: boolean; error?: string } => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) {
      return { isValid: false, error: 'Employee ID is required' };
    }

    if (selectedRole === 'EMPLOYEE') {
      if (/^(HR|ADMIN)[0-9_\-\s]?/i.test(cleanId)) {
        return {
          isValid: false,
          error: 'Invalid Employee ID. HR prefixes (e.g. HR1042) are reserved for HR/Admin role.',
        };
      }
    }

    if (selectedRole === 'HR') {
      if (/^EMP[0-9_\-\s]?/i.test(cleanId)) {
        return {
          isValid: false,
          error: 'Invalid HR ID. EMP prefixes (e.g. EMP1042) are reserved for Employee role.',
        };
      }
    }

    return { isValid: true };
  };

  const empIdValidation = validateEmployeeId(employeeId, role);
  const isEmployeeIdValid = empIdValidation.isValid;

  // Validation rules check for disabled button state
  const isFormValid =
    isEmployeeIdValid &&
    isEmailValid &&
    isPasswordValid &&
    doPasswordsMatch &&
    termsAccepted &&
    !!role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    if (!empIdValidation.isValid) newErrors.employeeId = empIdValidation.error || 'Invalid ID';
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!isEmailValid) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (!isPasswordValid) newErrors.password = 'Password does not satisfy all strength requirements';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!termsAccepted) newErrors.termsAccepted = 'You must accept the terms of service';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        employeeId: employeeId.trim(),
        email: email.trim(),
        password,
        role,
        termsAccepted,
      });

      toast.success('Account created! Please verify your email address.');
      navigate('/verify-email');

    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Registration failed. Please verify your details or try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [policyModalType, setPolicyModalType] = useState<'terms' | 'privacy' | null>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setEmployeeId(''); // Clear previous role's ID input
    setErrors((prev) => ({ ...prev, employeeId: '' }));
  };

  return (
    <Card className="w-full border-slate-200/80 shadow-lg">
      {/* Policy Dialog Modal */}
      {policyModalType && (
        <PolicyModal
          isOpen={!!policyModalType}
          onClose={() => setPolicyModalType(null)}
          type={policyModalType}
          onAcceptTerms={() => setTermsAccepted(true)}
        />
      )}

      <CardHeader className="text-center sm:text-left pb-2">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Create an account
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-1">
          Enter your details to get started
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{errors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <Label>Select Workspace Role</Label>
            <RoleSelector value={role} onChange={handleRoleChange} />
          </div>

          {/* Employee ID / HR ID */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-emp-id">{role === 'HR' ? 'HR / Admin ID' : 'Employee ID'}</Label>
            <Input
              id="reg-emp-id"
              placeholder={role === 'HR' ? 'Enter HR ID (e.g. HR001)' : 'Enter employee ID (e.g. EMP1042)'}
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                if (errors.employeeId) setErrors((prev) => ({ ...prev, employeeId: '' }));
              }}
              error={employeeId.trim().length > 0 && !isEmployeeIdValid}
            />
            {employeeId.trim().length > 0 && !isEmployeeIdValid && (
              <p className="text-xs font-medium text-red-600 mt-1">
                {empIdValidation.error}
              </p>
            )}
            {errors.employeeId && (employeeId.trim().length === 0 || isEmployeeIdValid) && (
              <p className="text-xs font-medium text-red-600 mt-1">{errors.employeeId}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Email address</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={!!errors.email}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={!!errors.password}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 stroke-[2]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                error={!!errors.confirmPassword}
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 stroke-[2]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          {/* Password Security UI (Strength & Match Indicator) */}
          <PasswordStrength
            password={password}
            confirmPassword={confirmPassword}
            showConfirmMatch={confirmPassword.length > 0}
          />

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="mt-0.5"
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="terms"
                className="text-xs text-slate-600 normal-case font-normal leading-tight cursor-pointer"
              >
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModalType('terms')}
                  className="font-semibold text-slate-900 underline hover:text-blue-600 cursor-pointer"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModalType('privacy')}
                  className="font-semibold text-slate-900 underline hover:text-blue-600 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </Label>
              {errors.termsAccepted && (
                <p className="text-xs font-medium text-red-600">{errors.termsAccepted}</p>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            type="submit"
            className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 text-sm shadow-md"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Creating account..."
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
