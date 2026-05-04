import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'edusmart' },
    update: {},
    create: {
      name: 'EduSmart',
      domain: 'edusmart.sn',
      subdomain: 'edusmart',
    },
  });

  console.log('Seeded tenant:', tenant);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
