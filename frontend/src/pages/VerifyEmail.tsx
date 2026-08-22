import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { EmailVerification } from '@/components/auth/EmailVerification';

export const VerifyEmail: React.FC = () => {
  return (
    <AuthLayout>
      <EmailVerification />
    </AuthLayout>
  );
};

export default VerifyEmail;
