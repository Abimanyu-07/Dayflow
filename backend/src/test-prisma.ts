import { prisma } from './lib/prisma';

async function testPrisma() {
  try {
    console.log('Testing PrismaClient with Driver Adapter...');
    const userCount = await prisma.users.count();
    console.log(`✅ PrismaClient connected successfully! Total users in DB: ${userCount}`);
  } catch (err: any) {
    console.error('❌ PrismaClient connection failed!');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
