import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json();
    console.log(`Starting import of ${students?.length} students`);
    
    // On récupère l'établissement actif via Prisma
    const tenant = await prisma.tenant.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    });
    
    if (!tenant) {
      return NextResponse.json({ error: 'Aucun établissement actif trouvé' }, { status: 404 });
    }
    const tenantId = tenant.id;
    console.log(`Targeting tenant ID: ${tenantId}`);

    let successCount = 0;
    for (const student of students) {
      try {
        const matricule = student.studentId || `SN-${Math.random().toString(36).slice(-5).toUpperCase()}`;
        const email = student.email || `${matricule.toLowerCase()}@edusmart.sn`;

        // Utilisation de Prisma pour créer le User et le Student lié en une seule transaction
        await prisma.user.create({
          data: {
            name: student.name,
            email: email,
            role: 'STUDENT',
            password: 'password123', // TODO: utiliser bcrypt pour hasher
            tenantId: tenantId,
            studentProfile: {
              create: {
                studentId: matricule,
                name: student.name,
                department: student.department || 'Général',
                tenantId: tenantId
              }
            }
          }
        });
        
        successCount++;
      } catch (err) {
        console.error(`Failed to insert student ${student.name}:`, err);
      }
    }

    console.log(`Import finished: ${successCount} successes`);
    return NextResponse.json({ 
      message: `${successCount} élèves importés avec succès`,
      count: successCount 
    });
  } catch (error: any) {
    console.error('Critical Import error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'importation', details: error.message }, { status: 500 });
  }
}
