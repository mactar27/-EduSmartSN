import { prisma } from '@/lib/prisma';

async function seedAcademics() {
  // 1. Get or create a tenant
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error('No tenant found. Run migration first.');
    return;
  }

  // 2. Create Faculty
  const faculty = await prisma.faculty.create({
    data: {
      name: 'Sciences et Technologies',
      tenantId: tenant.id,
    }
  });

  // 3. Create Department
  const dept = await prisma.department.create({
    data: {
      name: 'Informatique',
      facultyId: faculty.id,
    }
  });

  // 4. Create Unit of Teaching (UE)
  const ue = await prisma.unitOfTeaching.create({
    data: {
      name: 'Informatique Fondamentale',
      code: 'UE-INF-101',
      departmentId: dept.id,
    }
  });

  // 5. Create Subjects
  const subjects = [
    { name: 'Programmation C', code: 'INF1011', credits: 4, coefficient: 2 },
    { name: 'Structure de Données', code: 'INF1012', credits: 4, coefficient: 2 },
    { name: 'Anglais Technique', code: 'LAN1011', credits: 2, coefficient: 1 },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: s,
      create: {
        ...s,
        ueId: ue.id,
      }
    });
  }

  console.log('✅ Academic structure seeded.');
}

seedAcademics()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
