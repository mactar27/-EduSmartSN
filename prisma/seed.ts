import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a Tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'uvs' },
    update: {},
    create: {
      name: 'Université Virtuelle du Sénégal',
      subdomain: 'uvs',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Tenant created: ${tenant.name}`);

  // 2. Create Super Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@uvs.sn' },
    update: {},
    create: {
      email: 'admin@uvs.sn',
      name: 'Super Admin UVS',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log(`✅ Super Admin created: ${admin.email}`);

  // 3. Create a Faculty & Department
  const faculty = await prisma.faculty.create({
    data: {
      name: 'Sciences et Technologies',
      tenantId: tenant.id,
      departments: {
        create: {
          name: 'Informatique',
        }
      }
    },
    include: {
      departments: true
    }
  });

  const departmentId = faculty.departments[0].id;
  console.log(`✅ Faculty & Department created: Informatique`);

  // 4. Create an academic year
  const currentYear = new Date().getFullYear();
  const academicYear = await prisma.academicYear.create({
    data: {
      name: `${currentYear}-${currentYear + 1}`,
      start: new Date(`${currentYear}-09-01`),
      end: new Date(`${currentYear + 1}-07-31`),
      current: true,
      tenantId: tenant.id,
    },
  });

  console.log(`✅ Academic Year created: ${academicYear.name}`);

  console.log('🎉 Seed finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
