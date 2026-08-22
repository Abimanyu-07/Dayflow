import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const ResetPassword: React.FC = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
