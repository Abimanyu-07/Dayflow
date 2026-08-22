import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  authApi,
} from '@/services/authApi';
import { setAccessToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user session can be restored via refresh token cookie on mount
    const checkAuthSession = async () => {
      try {
        // Attempt token refresh
        const { accessToken } = await authApi.refresh();
        if (accessToken) {
          const userData = await authApi.getMe();
          setUser(userData);
        }
      } catch (error) {
        // No active session or unauthenticated
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      setPendingVerificationEmail(data.email);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string): Promise<void> => {
    await authApi.resendVerification(email);
  };

  const forgotPassword = async (email: string): Promise<string> => {
    const result = await authApi.forgotPassword(email);
    return result.message;
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    await authApi.resetPassword(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        pendingVerificationEmail,
        setPendingVerificationEmail,
        login,
        register,
        logout,
        resendVerification,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
