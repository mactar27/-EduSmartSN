import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();

  try {
    const count = await prisma.demoRequest.count();
    console.log('Standard Prisma connected! Count:', count);
  } catch (err) {
    console.error('Standard Prisma failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
