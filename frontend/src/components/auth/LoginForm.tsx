import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setUnverifiedEmail(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const user = await login({ email, password, rememberMe });
      toast.success('Signed in successfully');

      // Security requirement 7: redirect based on user role
      if (user.role === 'HR') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { code?: string; message?: string; email?: string } } };
      
      if (apiErr.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(apiErr.response.data.email || email);
        setErrors({ general: 'Your email address is not verified yet.' });
      } else {
        // Generic invalid credentials error (wrong password or unregistered email)
        setErrors({ general: apiErr.response?.data?.message || 'Invalid email or password' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-slate-200/80 shadow-lg">
      <CardHeader className="text-center sm:text-left pb-2">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-1">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* General Alert Banner */}
        {errors.general && (
          <Alert variant={unverifiedEmail ? 'warning' : 'destructive'} className="mb-5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {errors.general}
              {unverifiedEmail && (
                <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs">Need to verify your account?</span>
                  <Link
                    to="/verify-email"
                    className="text-xs font-bold underline text-amber-900 hover:text-amber-950"
                  >
                    Verify Email Now &rarr;
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
              }}
              error={!!errors.email}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
                }}
                error={!!errors.password}
                className="pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 stroke-[2]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label
                htmlFor="remember"
                className="text-xs text-slate-600 normal-case font-medium cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Primary Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 text-sm shadow-md"
            isLoading={isSubmitting}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
        </form>

        {/* Switch to Register link */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
          >
            Create Account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
