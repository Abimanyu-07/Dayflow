import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/services/authApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const maskEmail = (email: string = 'employee@example.com'): string => {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [name, domain] = parts;
  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

export const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const { pendingVerificationEmail, resendVerification } = useAuth();
  const emailToVerify = pendingVerificationEmail || 'unverified@dayflow.hr';

  const [cooldown, setCooldown] = useState<number>(30);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      await resendVerification(emailToVerify);
      toast.success('Verification email sent!');
      setCooldown(30); // reset 30s cooldown
    } catch (err: unknown) {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSimulateVerification = async () => {
    setIsVerifying(true);
    try {
      await authApi.verifyEmail({ email: emailToVerify, token: 'mock_verification_token' });
      toast.success('Email verified successfully! You can now sign in.');
      navigate('/login');
    } catch (err: unknown) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full border-slate-200/80 shadow-lg text-center">
      <CardHeader className="pt-8 pb-4 flex flex-col items-center">
        <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-blue-600 shadow-xs">
          <Mail className="h-8 w-8 stroke-[1.8]" />
        </div>
        <CardTitle className="text-2xl font-extrabold text-slate-900">
          Verify your email
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
          We've sent a verification link to your email address. Please verify your email to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Masked Email Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 border border-slate-200/80 text-sm font-semibold text-slate-900 font-mono">
          {maskEmail(emailToVerify)}
        </div>

        {/* Info box */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 text-xs text-emerald-900 text-left flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Check your inbox</span>
            Click the link in the email to activate your account. Be sure to check your spam or junk folder.
          </div>
        </div>

        {/* Interactive Verification Simulation Button */}
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-left space-y-2">
          <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
            <span>Simulate Inbox Link Click</span>
          </div>
          <p className="text-[11px] text-blue-800 leading-snug">
            In development / testing mode, click below to simulate clicking the email link sent by Gmail SMTP.
          </p>
          <Button
            onClick={handleSimulateVerification}
            isLoading={isVerifying}
            loadingText="Verifying..."
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-xs"
          >
            Confirm & Verify Email Now
          </Button>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-1">
          <Button
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            isLoading={isResending}
            loadingText="Resending..."
            variant="outline"
            className="w-full h-10 border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 text-xs"
          >
            {cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend verification email'}
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 pt-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
