import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PasswordStrength, evaluatePassword } from './PasswordStrength';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const rules = evaluatePassword(password);
  const isPasswordValid = Object.values(rules).every(Boolean);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isPasswordValid) {
      setErrorMsg('Password does not satisfy all strength requirements');
      return;
    }

    if (!doPasswordsMatch) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ password });
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err: unknown) {
      setErrorMsg('Failed to reset password. Please try requesting a new link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-slate-200/80 shadow-lg">
      <CardHeader className="text-center sm:text-left">
        <div className="mx-auto sm:mx-0 h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 text-slate-800">
          <ShieldCheck className="h-6 w-6 stroke-[2]" />
        </div>
        <CardTitle className="text-2xl font-extrabold text-slate-900">
          Reset your password
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          Create a new strong password for your Dayflow account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-left flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Password updated successfully</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Your credentials have been securely updated. You can now log in with your new password.
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 text-sm shadow-md"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                {errorMsg}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reset-new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <Label htmlFor="reset-confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Strength indicator */}
            <PasswordStrength
              password={password}
              confirmPassword={confirmPassword}
              showConfirmMatch={confirmPassword.length > 0}
            />

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 text-sm shadow-md mt-3"
              disabled={!isPasswordValid || !doPasswordsMatch || isSubmitting}
              isLoading={isSubmitting}
              loadingText="Resetting..."
            >
              Reset Password
            </Button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
