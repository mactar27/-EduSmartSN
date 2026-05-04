import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPrismaData() {
  const tenants = await prisma.tenant.count();
  const users = await prisma.user.count();
  const students = await prisma.student.count();

  console.log('Prisma Data Counts:');
  console.log('Tenants:', tenants);
  console.log('Users:', users);
  console.log('Students:', students);

  if (tenants > 0) {
    const firstTenant = await prisma.tenant.findFirst();
    console.log('First Tenant:', firstTenant);
  }
}

checkPrismaData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
