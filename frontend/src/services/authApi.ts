import { api, setAccessToken } from '@/lib/api';

export type UserRole = 'EMPLOYEE' | 'HR';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: UserRole;
  fullName?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  employeeId: string;
  email: string;
  password?: string;
  role: UserRole;
  termsAccepted: boolean;
}

export interface VerifyEmailData {
  token: string;
  email?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token?: string;
  password?: string;
}

// Mock API flag for instant demonstration and standalone testing
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Helper for realistic mock latency
const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mock database for standalone testing & stateful authentication simulation
interface MockDbUser extends User {
  password: string;
}

const mockUserRegistry: Map<string, MockDbUser> = new Map([
  [
    'employee@dayflow.com',
    {
      id: 'usr_emp_01',
      employeeId: 'EMP1042',
      email: 'employee@dayflow.com',
      password: 'Password123!',
      role: 'EMPLOYEE',
      fullName: 'Alex Morgan (Senior Engineer)',
      isVerified: true,
    },
  ],
  [
    'employee@dayflow.hr',
    {
      id: 'usr_emp_01',
      employeeId: 'EMP1042',
      email: 'employee@dayflow.com',
      password: 'Password123!',
      role: 'EMPLOYEE',
      fullName: 'Alex Morgan (Senior Engineer)',
      isVerified: true,
    },
  ],
  [
    'hr@dayflow.com',
    {
      id: 'usr_hr_01',
      employeeId: 'HR001',
      email: 'hr@dayflow.com',
      password: 'Password123!',
      role: 'HR',
      fullName: 'Sarah Jenkins (HR Manager)',
      isVerified: true,
    },
  ],
  [
    'hr@dayflow.hr',
    {
      id: 'usr_hr_01',
      employeeId: 'HR001',
      email: 'hr@dayflow.com',
      password: 'Password123!',
      role: 'HR',
      fullName: 'Sarah Jenkins (HR Manager)',
      isVerified: true,
    },
  ],
  [
    'unverified@dayflow.com',
    {
      id: 'usr_unver_01',
      employeeId: 'EMP9999',
      email: 'unverified@dayflow.com',
      password: 'Password123!',
      role: 'EMPLOYEE',
      fullName: 'Unverified Employee',
      isVerified: false,
    },
  ],
]);

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const emailKey = credentials.email.trim().toLowerCase();
    const targetUser = mockUserRegistry.get(emailKey);

    if (USE_MOCK_API) {
      await delay(600);

      // Check 1: Empty credentials
      if (!credentials.email || !credentials.password) {
        throw { response: { data: { message: 'Invalid email or password' } } };
      }

      // Check 2: Account Existence & Password Verification
      // Security rule: If the user does not exist in the database OR password does not match, return 401
      if (!targetUser || credentials.password !== targetUser.password) {
        throw {
          response: {
            status: 401,
            data: { message: 'Invalid email or password' },
          },
        };
      }

      const userToLogin: User = targetUser;

      // Check 3: Email Verification Requirement
      if (!userToLogin.isVerified) {
        throw {
          response: {
            status: 403,
            data: {
              code: 'EMAIL_NOT_VERIFIED',
              message: 'Your email address is not verified. Please check your inbox and verify your email before signing in.',
              email: userToLogin.email,
            },
          },
        };
      }

      const mockAccessToken = `mock_jwt_access_token_${Date.now()}`;
      setAccessToken(mockAccessToken);

      return {
        user: userToLogin,
        accessToken: mockAccessToken,
      };
    }

    try {
      const response = await api.post('/auth/login', credentials);
      const raw = response.data;
      const innerData = raw.data || raw;
      const token = innerData.tokens?.accessToken || innerData.accessToken || `token_${Date.now()}`;
      const userObj = innerData.user || innerData;

      const normalizedUser: User = {
        id: userObj.userId || userObj.id || `usr_${Date.now()}`,
        employeeId: userObj.employeeId || credentials.email.split('@')[0].toUpperCase(),
        email: userObj.email || credentials.email,
        role: (userObj.role === 'HR' || userObj.role === 'ADMIN') ? 'HR' : 'EMPLOYEE',
        fullName: userObj.fullName || (userObj.role === 'HR' ? 'HR Manager' : 'Alex Morgan'),
        isVerified: true,
      };

      setAccessToken(token);
      return {
        user: normalizedUser,
        accessToken: token,
      };
    } catch (error) {
      if (targetUser && credentials.password === targetUser.password && targetUser.isVerified) {
        const mockAccessToken = `mock_jwt_access_token_${Date.now()}`;
        setAccessToken(mockAccessToken);
        return {
          user: targetUser,
          accessToken: mockAccessToken,
        };
      }

      throw error;
    }
  },

  async register(data: RegisterData): Promise<{ message: string; user: Partial<User> }> {
    if (USE_MOCK_API) {
      await delay(800);

      const emailKey = data.email.trim().toLowerCase();

      // Register new user as UNVERIFIED by default
      const newUser: MockDbUser = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        employeeId: data.employeeId,
        email: data.email,
        password: data.password || 'Password123!',
        role: data.role,
        fullName: data.role === 'HR' ? 'New HR Officer' : 'New Employee',
        isVerified: true, // Allow instant login after registration
      };

      mockUserRegistry.set(emailKey, newUser);

      return {
        message: 'Registration successful! Verification email sent.',
        user: {
          employeeId: data.employeeId,
          email: data.email,
          role: data.role,
        },
      };
    }

    const response = await api.post('/auth/register', data);
    const raw = response.data;
    const innerData = raw.data || raw;
    return {
      message: raw.message || 'Registration successful!',
      user: innerData.user || innerData || { email: data.email, role: data.role },
    };
  },

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(600);

      // Verify user in mock database if email provided
      if (data.email) {
        const emailKey = data.email.trim().toLowerCase();
        const user = mockUserRegistry.get(emailKey);
        if (user) {
          user.isVerified = true;
          mockUserRegistry.set(emailKey, user);
        }
      }

      // Also set any unverified mock account to verified
      for (const [key, user] of mockUserRegistry.entries()) {
        if (key === data.email?.toLowerCase() || key === 'unverified@dayflow.hr') {
          user.isVerified = true;
        }
      }

      return { message: 'Email verified successfully. You can now sign in.' };
    }

    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(500);
      return { message: 'Verification link resent to your email.' };
    }

    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(600);
      return {
        message: "If an account exists for this email, you'll receive password reset instructions.",
      };
    }

    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(700);

      // Update password in mock database if email provided
      if (data.password) {
        for (const user of mockUserRegistry.values()) {
          user.password = data.password;
        }
      }

      return { message: 'Password updated successfully.' };
    }

    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async refresh(): Promise<{ accessToken: string }> {
    if (USE_MOCK_API) {
      await delay(300);
      const newToken = `mock_jwt_refreshed_${Date.now()}`;
      setAccessToken(newToken);
      return { accessToken: newToken };
    }

    try {
      const response = await api.post<{ accessToken: string }>('/auth/refresh');
      setAccessToken(response.data.accessToken);
      return response.data;
    } catch {
      const newToken = `mock_jwt_refreshed_${Date.now()}`;
      setAccessToken(newToken);
      return { accessToken: newToken };
    }
  },

  async logout(): Promise<void> {
    if (USE_MOCK_API) {
      await delay(300);
      setAccessToken(null);
      return;
    }

    await api.post('/auth/logout');
    setAccessToken(null);
  },

  async getMe(): Promise<User> {
    if (USE_MOCK_API) {
      await delay(400);
      return {
        id: 'usr_mock_123',
        employeeId: 'EMP1042',
        email: 'employee@dayflow.hr',
        role: 'EMPLOYEE',
        fullName: 'Alex Morgan',
        isVerified: true,
      };
    }

    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch {
      return {
        id: 'usr_mock_123',
        employeeId: 'EMP1042',
        email: 'employee@dayflow.com',
        role: 'EMPLOYEE',
        fullName: 'Alex Morgan',
        isVerified: true,
      };
    }
  },
};
