import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userTenantId = request.headers.get('x-tenant-id');

    if (!userRole || !userTenantId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (userRole !== "PROFESSOR" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const body = await request.json();
    const { subjectId, grades } = body;

    if (!subjectId || !grades || !Array.isArray(grades)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    // Sécurité : On force le tenantId de l'utilisateur connecté
    const results = [];
    for (const grade of grades) {
      const { studentId, value } = grade;
      const existing = await prisma.grade.findFirst({
        where: { studentId, subjectId, tenantId: userTenantId }
      });
      
      if (existing) {
        const updated = await prisma.grade.update({ where: { id: existing.id }, data: { value } });
        results.push(updated);
      } else {
        const created = await prisma.grade.create({ data: { studentId, subjectId, value, tenantId: userTenantId } });
        results.push(created);
      }
    }

    return NextResponse.json({ message: 'Notes enregistrées avec succès', results }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving grades:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde des notes', details: error.message }, { status: 500 });
  }
}

