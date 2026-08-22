import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password?: string;
  confirmPassword?: string;
  showConfirmMatch?: boolean;
}

export interface PasswordRules {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const evaluatePassword = (password: string = ''): PasswordRules => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password = '',
  confirmPassword,
  showConfirmMatch = false,
}) => {
  const rules = evaluatePassword(password);
  const passedCount = Object.values(rules).filter(Boolean).length;

  // Strength score bar calculation
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  let strengthPercentage = (passedCount / 5) * 100;

  if (passedCount === 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
  } else if (passedCount >= 3) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
  }

  const isMatch = showConfirmMatch && confirmPassword && password && password === confirmPassword;
  const isMismatch = showConfirmMatch && confirmPassword && password && password !== confirmPassword;

  const ruleItems = [
    { label: '8+ characters', pass: rules.minLength },
    { label: 'Uppercase letter', pass: rules.hasUppercase },
    { label: 'Lowercase letter', pass: rules.hasLowercase },
    { label: 'Number', pass: rules.hasNumber },
    { label: 'Special character (!@#$...)', pass: rules.hasSpecial },
  ];

  return (
    <div className="space-y-3 pt-1.5 pb-1">
      {/* Strength indicator bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Password strength</span>
          <span
            className={cn(
              'font-semibold text-[11px]',
              passedCount === 5
                ? 'text-emerald-600'
                : passedCount >= 3
                ? 'text-amber-600'
                : 'text-slate-500'
            )}
          >
            {password.length > 0 ? strengthLabel : 'Enter password'}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden flex">
          <div
            className={cn('h-full transition-all duration-300', strengthColor)}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Rules checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
        {ruleItems.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center gap-1.5 transition-colors',
              item.pass ? 'text-emerald-700 font-medium' : 'text-slate-400'
            )}
          >
            <div
              className={cn(
                'h-3.5 w-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors',
                item.pass ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'
              )}
            >
              {item.pass ? (
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              ) : (
                <div className="h-1 w-1 rounded-full bg-slate-400" />
              )}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Confirm Password match indicator */}
      {showConfirmMatch && confirmPassword !== undefined && (
        <div className="pt-1 border-t border-slate-100">
          {isMatch && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
              <span>Passwords match</span>
            </div>
          )}
          {isMismatch && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <X className="h-3.5 w-3.5 text-red-500" />
              <span>Passwords do not match</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
