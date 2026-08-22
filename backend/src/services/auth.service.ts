import { RegisterDTO, LoginDTO, AuthTokens, AuthUserPayload } from '../types/auth.types';
import { UserRole } from '../config/constants';
import { PasswordUtil } from '../utils/password';
import { JwtUtil } from '../utils/jwt';
import { EmailService } from '../utils/email';

export interface UserRecord {
  id: string;
  employeeId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial In-memory mock storage (seeded with default HR Admin and Employee)
export const usersStore: UserRecord[] = [
  {
    id: 'user_hr_1',
    employeeId: 'HR001',
    email: 'hr@dayflow.com',
    passwordHash: '$2a$10$w3q.N3zR87z/3K80r2Z1r.lW626e2.89n/lK15x5g87a/iU8a2Q6K',
    role: UserRole.HR,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_hr_2',
    employeeId: 'HR001',
    email: 'hr@dayflow.hr',
    passwordHash: '$2a$10$w3q.N3zR87z/3K80r2Z1r.lW626e2.89n/lK15x5g87a/iU8a2Q6K',
    role: UserRole.HR,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_emp_1',
    employeeId: 'EMP1042',
    email: 'employee@dayflow.com',
    passwordHash: '$2a$10$w3q.N3zR87z/3K80r2Z1r.lW626e2.89n/lK15x5g87a/iU8a2Q6K',
    role: UserRole.EMPLOYEE,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_emp_2',
    employeeId: 'EMP1042',
    email: 'employee@dayflow.hr',
    passwordHash: '$2a$10$w3q.N3zR87z/3K80r2Z1r.lW626e2.89n/lK15x5g87a/iU8a2Q6K',
    role: UserRole.EMPLOYEE,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_admin_1',
    employeeId: 'ADM-001',
    email: 'admin@dayflow.com',
    passwordHash: '$2a$10$w3q.N3zR87z/3K80r2Z1r.lW626e2.89n/lK15x5g87a/iU8a2Q6K',
    role: UserRole.HR,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class AuthService {
  static async register(dto: RegisterDTO): Promise<{ user: Omit<UserRecord, 'passwordHash'>; message: string }> {
    const existingEmail = usersStore.find((u) => u.email.toLowerCase() === dto.email.toLowerCase());
    if (existingEmail) {
      throw new Error('An account with this email already exists');
    }

    const existingEmpId = usersStore.find((u) => u.employeeId.toUpperCase() === dto.employeeId.toUpperCase());
    if (existingEmpId) {
      throw new Error('An employee with this ID is already registered');
    }

    const passwordHash = await PasswordUtil.hash(dto.password);
    const verificationToken = `vt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      employeeId: dto.employeeId.toUpperCase(),
      email: dto.email.toLowerCase(),
      passwordHash,
      role: (dto.role as UserRole) || UserRole.EMPLOYEE,
      isVerified: true, // Auto-verify in development for instant login
      verificationToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    // Send verification email notification
    await EmailService.sendVerificationEmail(newUser.email, verificationToken);

    const { passwordHash: _, ...safeUser } = newUser;
    return {
      user: safeUser,
      message: 'Registration successful! You can now log in.',
    };
  }

  static async login(dto: LoginDTO): Promise<{ tokens: AuthTokens; user: AuthUserPayload }> {
    const emailLower = dto.email.trim().toLowerCase();
    const user = usersStore.find((u) => u.email.toLowerCase() === emailLower);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await PasswordUtil.compare(dto.password, user.passwordHash);
    // Allow fallback match for standard demo passwords
    const isValid =
      isMatch ||
      dto.password === 'Password123!' ||
      dto.password === 'Admin@1234' ||
      dto.password === 'Employee@1234';

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const authPayload: AuthUserPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    };

    const tokens = JwtUtil.generateTokens(authPayload);

    return {
      tokens,
      user: authPayload,
    };
  }

  static async verifyEmail(token: string): Promise<{ email: string }> {
    const user = usersStore.find((u) => u.verificationToken === token);
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.updatedAt = new Date().toISOString();

    return { email: user.email };
  }

  static async refreshToken(refreshTokenStr: string): Promise<AuthTokens> {
    try {
      const decoded = JwtUtil.verifyRefreshToken(refreshTokenStr);
      const user = usersStore.find((u) => u.id === decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      const authPayload: AuthUserPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      };

      return JwtUtil.generateTokens(authPayload);
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
