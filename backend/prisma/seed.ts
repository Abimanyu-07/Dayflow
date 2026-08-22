import { prisma } from '../src/config/prisma';
import { PasswordUtil } from '../src/utils/password';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Departments
  const engineering = await prisma.departments.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: {
      name: 'Engineering',
      description: 'Software development, QA, and Technical Operations',
    },
  });

  const hrDept = await prisma.departments.upsert({
    where: { name: 'Human Resources' },
    update: {},
    create: {
      name: 'Human Resources',
      description: 'Talent Acquisition, Employee Welfare, and Payroll',
    },
  });

  const salesDept = await prisma.departments.upsert({
    where: { name: 'Sales & Marketing' },
    update: {},
    create: {
      name: 'Sales & Marketing',
      description: 'Business development and customer relations',
    },
  });

  console.log('✅ Departments seeded:', [engineering.name, hrDept.name, salesDept.name]);

  // 2. Seed Leave Types
  const paidLeave = await prisma.leave_types.upsert({
    where: { name: 'Paid Leave' },
    update: {},
    create: {
      name: 'Paid Leave',
      description: 'Standard annual paid time off',
      max_days: 18,
    },
  });

  const sickLeave = await prisma.leave_types.upsert({
    where: { name: 'Sick Leave' },
    update: {},
    create: {
      name: 'Sick Leave',
      description: 'Medical and health recovery leave',
      max_days: 12,
    },
  });

  const casualLeave = await prisma.leave_types.upsert({
    where: { name: 'Casual Leave' },
    update: {},
    create: {
      name: 'Casual Leave',
      description: 'Short unplanned absences',
      max_days: 6,
    },
  });

  console.log('✅ Leave types seeded:', [paidLeave.name, sickLeave.name, casualLeave.name]);

  // 3. Seed Admin / HR User
  const adminPasswordHash = await PasswordUtil.hash('Admin@1234');
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      email: 'admin@dayflow.com',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
      is_active: true,
      is_verified: true,
    },
  });

  await prisma.employees.upsert({
    where: { user_id: adminUser.id },
    update: {},
    create: {
      user_id: adminUser.id,
      employee_code: 'ADM001',
      first_name: 'Admin',
      last_name: 'Officer',
      department_id: hrDept.id,
      designation: 'Head of Human Resources',
      salary: 150000,
    },
  });

  // 4. Seed Employee User
  const empPasswordHash = await PasswordUtil.hash('Employee@1234');
  const empUser = await prisma.users.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      email: 'employee@dayflow.com',
      password_hash: empPasswordHash,
      role: 'EMPLOYEE',
      is_active: true,
      is_verified: true,
    },
  });

  await prisma.employees.upsert({
    where: { user_id: empUser.id },
    update: {},
    create: {
      user_id: empUser.id,
      employee_code: 'EMP101',
      first_name: 'Rahul',
      last_name: 'Sharma',
      department_id: engineering.id,
      designation: 'Senior Software Engineer',
      phone: '+91 9876543210',
      salary: 120000,
    },
  });

  console.log('✅ Demo accounts seeded: admin@dayflow.com and employee@dayflow.com');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
