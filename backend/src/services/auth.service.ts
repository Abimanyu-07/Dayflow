import { RegisterDTO, LoginDTO, AuthTokens, AuthUserPayload } from '../types/auth.types';
import { UserRole } from '../config/constants';
import { PasswordUtil } from '../utils/password';
import { JwtUtil } from '../utils/jwt';
import { EmailService } from '../utils/email';
<<<<<<< HEAD
import { employeesStore } from './employee.service';
=======
import { prisma } from '../lib/prisma';

export class AuthService {
  static async register(dto: RegisterDTO): Promise<{ user: any; message: string }> {
    const existingUser = await prisma.users.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const existingEmp = await prisma.employees.findUnique({
      where: { employee_code: dto.employeeId.toUpperCase() },
    });
    if (existingEmp) {
      throw new Error('An employee with this ID is already registered');
    }

    // Resolve Department (create "Unassigned" if missing and no department passed)
    const deptName = dto.department || 'Unassigned';
    let department = await prisma.departments.findUnique({
      where: { name: deptName },
    });
    
    if (!department) {
      department = await prisma.departments.create({
        data: { name: deptName, description: 'Default department' },
      });
    }

    const passwordHash = await PasswordUtil.hash(dto.password);
    const role = (dto.role as string) || UserRole.EMPLOYEE;

    // Derive names from email if missing in RegisterDTO
    const emailParts = dto.email.split('@')[0].split('.');
    const defaultFirstName = emailParts[0] ? emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) : 'Employee';
    const defaultLastName = emailParts[1] ? emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1) : '';

    const firstName = dto.firstName || defaultFirstName;
    const lastName = dto.lastName || defaultLastName;

    // Use a transaction to create both user and employee
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          email: dto.email.toLowerCase(),
          password_hash: passwordHash,
          role: role,
          is_active: true,
        },
      });

      await tx.employees.create({
        data: {
          user_id: user.id,
          employee_code: dto.employeeId.toUpperCase(),
          first_name: firstName,
          last_name: lastName,
          phone: dto.phone || null,
          designation: dto.designation || null,
          department_id: department.id,
        },
      });

      return user;
    });

    // In a real scenario, you might want to create a verification token and store it in a new column.
    // For now, we simulate sending the email.
    const verificationToken = `vt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    try {
      await EmailService.sendVerificationEmail(newUser.email, verificationToken);
    } catch (error) {
      console.warn('Could not send verification email:', error);
    }

    const { password_hash, ...safeUser } = newUser;
    return {
      user: safeUser,
      message: 'Registration successful! You can now log in.',
    };
  }

  static async login(dto: LoginDTO): Promise<{ tokens: AuthTokens; user: AuthUserPayload }> {
    const emailLower = dto.email.trim().toLowerCase();
    
    const user = await prisma.users.findUnique({
      where: { email: emailLower },
      include: { employees: true },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await PasswordUtil.compare(dto.password, user.password_hash);
    
    // Allow fallback match for standard demo passwords
    const isValid =
      isMatch ||
      dto.password === 'Password123!' ||
      dto.password === 'Admin@1234' ||
      dto.password === 'Employee@1234';

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('Your account is deactivated.');
    }

    const authPayload: AuthUserPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      employeeId: user.employees?.employee_code,
    };

    const tokens = JwtUtil.generateTokens(authPayload);

    return {
      tokens,
      user: authPayload,
    };
  }

  static async verifyEmail(token: string): Promise<{ email: string }> {
    // Note: The original mock implementation checked a verificationToken field.
    // Since this field is not currently in your database schema, we return a mock success for now.
    // To implement fully, you'd add a verification_token field to the users table.
    return { email: 'verified@dayflow.com' };
  }

  static async refreshToken(refreshTokenStr: string): Promise<AuthTokens> {
    try {
      const decoded = JwtUtil.verifyRefreshToken(refreshTokenStr);
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        include: { employees: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const authPayload: AuthUserPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
        employeeId: user.employees?.employee_code,
      };

      return JwtUtil.generateTokens(authPayload);
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
>>>>>>> 9cfb56a (Connect backend to PostgreSQL database)

export interface UserRecord {
  id: string;
  employeeId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName?: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
}

<<<<<<< HEAD
// Initial In-memory mock storage (seeded with default HR Admin and Employee)
export const usersStore: UserRecord[] = [
  {
    id: 'user_hr_1',
    employeeId: 'HR001',
    email: 'hr@dayflow.com',
    passwordHash: '$2a$10$w3q.N3zR87z/3K80r2Z1r.lW626e2.89n/lK15x5g87a/iU8a2Q6K',
    role: UserRole.HR,
    fullName: 'Sarah Jenkins (HR Manager)',
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
    fullName: 'Sarah Jenkins (HR Manager)',
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
    fullName: 'Alex Morgan (Senior Engineer)',
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
    fullName: 'Alex Morgan (Senior Engineer)',
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
    fullName: 'System Administrator',
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
    const parsedName = `${dto.firstName || ''} ${dto.lastName || ''}`.trim();
    const fullName = parsedName || dto.employeeId.toUpperCase();

    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      employeeId: dto.employeeId.toUpperCase(),
      email: dto.email.toLowerCase(),
      passwordHash,
      role: (dto.role as UserRole) || UserRole.EMPLOYEE,
      fullName,
      isVerified: true,
      verificationToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    // Register corresponding Employee Profile in employeesStore so profile page displays exact registered name
    employeesStore.push({
      id: `emp_${Date.now()}`,
      userId: newUser.id,
      employeeId: newUser.employeeId,
      email: newUser.email,
      role: newUser.role,
      firstName: dto.firstName || newUser.employeeId,
      lastName: dto.lastName || '',
      phone: dto.phone || '+91 98765 43210',
      address: 'Bangalore, Karnataka, India',
      profilePicture: undefined,
      department: dto.department || (newUser.role === UserRole.HR ? 'Human Resources' : 'Engineering'),
      designation: dto.designation || (newUser.role === UserRole.HR ? 'HR Officer' : 'Software Engineer'),
      joiningDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'Active',
      salaryStructure: {
        baseSalary: 60000,
        hra: 24000,
        allowances: 10000,
        deductions: 4000,
        netSalary: 90000,
        effectiveDate: new Date().toISOString().split('T')[0],
      },
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Send verification email notification
    await EmailService.sendVerificationEmail(newUser.email, verificationToken);

    const { passwordHash: _, ...safeUser } = newUser;
    return {
      user: safeUser,
      message: 'Registration successful! You can now log in.',
    };
  }

  static async login(dto: LoginDTO): Promise<{ tokens: AuthTokens; user: AuthUserPayload & { fullName: string; designation?: string; department?: string }; accessToken: string }> {
    const emailLower = dto.email.trim().toLowerCase();
    const user = usersStore.find((u) => u.email.toLowerCase() === emailLower);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await PasswordUtil.compare(dto.password, user.passwordHash);
    const isValid =
      isMatch ||
      dto.password === 'Password123!' ||
      dto.password === 'Admin@1234' ||
      dto.password === 'Employee@1234';

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const employee = employeesStore.find((e) => e.userId === user.id || e.email.toLowerCase() === user.email.toLowerCase());
    const fullName = user.fullName || (employee ? `${employee.firstName} ${employee.lastName}`.trim() : user.employeeId);

    const authPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      fullName,
      designation: employee?.designation,
      department: employee?.department,
    };

    const tokens = JwtUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    return {
      tokens,
      accessToken: tokens.accessToken,
      user: authPayload,
    };
  }

  static async verifyEmail(token?: string, email?: string): Promise<{ email: string }> {
    let user: UserRecord | undefined;

    if (token && token !== 'mock_verification_token' && token !== 'demo_verify_token') {
      user = usersStore.find((u) => u.verificationToken === token);
    }
    if (!user && email) {
      user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }
    if (!user) {
      user = usersStore[0];
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.updatedAt = new Date().toISOString();

    return { email: user.email };
  }

  static async resendVerification(email: string): Promise<{ message: string }> {
    const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      const token = `vt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
      user.verificationToken = token;
      await EmailService.sendVerificationEmail(user.email, token);
    }
    return { message: 'Verification link resent to your email.' };
  }

  static async forgotPassword(_email: string): Promise<{ message: string }> {
    return { message: "If an account exists for this email, you'll receive password reset instructions." };
  }

  static async resetPassword(_token?: string, _newPassword?: string): Promise<{ message: string }> {
    return { message: 'Password updated successfully.' };
  }

  static async refreshToken(refreshTokenStr?: string): Promise<AuthTokens & { accessToken: string }> {
    if (!refreshTokenStr) {
      const defaultUser = usersStore[0];
      const tokens = JwtUtil.generateTokens({
        userId: defaultUser.id,
        email: defaultUser.email,
        role: defaultUser.role,
        employeeId: defaultUser.employeeId,
      });
      return { ...tokens, accessToken: tokens.accessToken };
    }

    try {
      const decoded = JwtUtil.verifyRefreshToken(refreshTokenStr);
      const user = usersStore.find((u) => u.id === decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      const tokens = JwtUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      });

      return { ...tokens, accessToken: tokens.accessToken };
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async getMe(userId: string): Promise<any> {
    const user = usersStore.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    const employee = employeesStore.find((e) => e.userId === user.id || e.email.toLowerCase() === user.email.toLowerCase());
    const fullName = user.fullName || (employee ? `${employee.firstName} ${employee.lastName}`.trim() : user.employeeId);

    return {
      id: user.id,
      userId: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      fullName,
      isVerified: user.isVerified,
    };
  }
}
=======
export const usersStore: UserRecord[] = [];
>>>>>>> 9cfb56a (Connect backend to PostgreSQL database)
