import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { ENV } from './env';

const pool = new pg.Pool({
  connectionString: ENV.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dayflow_hrms?schema=public',
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ENV.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export async function testDbConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL Database connected successfully via Prisma');
    return true;
  } catch (error: any) {
    console.log('ℹ️ Database connection note:', error?.message || 'Database not reachable, using in-memory layer');
    return false;
  }
}
