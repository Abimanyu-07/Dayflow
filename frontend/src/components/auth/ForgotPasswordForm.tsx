import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setIsSubmitted(true);
      toast.success('Reset instructions requested.');
    } catch (err: unknown) {
      // Even on error, show the same generic state or handle graceful retry
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-slate-200/80 shadow-lg">
      <CardHeader className="text-center sm:text-left">
        <div className="mx-auto sm:mx-0 h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 text-slate-800">
          <KeyRound className="h-6 w-6 stroke-[2]" />
        </div>
        <CardTitle className="text-2xl font-extrabold text-slate-900">
          Forgot your password?
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          Enter your registered email and we'll send you a password reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-5 text-center">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Check your email</h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    If an account exists for <span className="font-semibold">{email}</span>, you'll receive password reset instructions shortly.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full h-10 text-sm font-semibold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Email address</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                error={!!emailError}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-xs font-medium text-red-600 mt-1">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 text-sm shadow-md mt-2"
              isLoading={isSubmitting}
              loadingText="Sending link..."
            >
              Send Reset Link
            </Button>

            <div className="pt-4 border-t border-slate-100 text-center">
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
