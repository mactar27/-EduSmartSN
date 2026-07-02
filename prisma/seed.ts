import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create a default Tenant (Souveraineté Numérique)
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'souverainete-numerique' },
    update: {},
    create: {
      name: 'Souveraineté Numérique',
      domain: 'edusmartsn.vercel.app',
      subdomain: 'souverainete-numerique',
      primaryColor: '#1e40af',
      secondaryColor: '#10b981',
      status: 'ACTIVE',
    },
  })

  console.log(`Created Tenant: ${tenant.name}`)

  // 2. Create the Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'ndiayeamadoumactar3@gmail.com' },
    update: {
      password: 'password123', // Resetting password for consistency
      role: 'SUPER_ADMIN',
      tenantId: tenant.id
    },
    create: {
      email: 'ndiayeamadoumactar3@gmail.com',
      password: 'password123',
      name: 'Amadou Mactar Ndiaye',
      role: 'SUPER_ADMIN',
      tenantId: tenant.id,
    },
  })

  console.log(`Created Super Admin User: ${adminUser.email}`)

  // 3. Create a test Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2024-2025',
      tenantId: tenant.id,
      start: new Date('2024-09-01'),
      end: new Date('2025-07-31'),
      current: true,
    }
  })
  
  console.log(`Created Academic Year: ${academicYear.name}`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
