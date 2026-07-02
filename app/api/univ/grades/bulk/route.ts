import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subjectId, grades } = body;

    if (!subjectId || !grades || !Array.isArray(grades)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const results = [];
    for (const grade of grades) {
      const { studentId, value } = grade;
      const existing = await prisma.grade.findFirst({
        where: { studentId, subjectId }
      });
      
      if (existing) {
        const updated = await prisma.grade.update({ where: { id: existing.id }, data: { value } });
        results.push(updated);
      } else {
        const created = await prisma.grade.create({ data: { studentId, subjectId, value } });
        results.push(created);
      }
    }

    return NextResponse.json({ message: 'Notes enregistrées avec succès', results }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving grades:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde des notes', details: error.message }, { status: 500 });
  }
}

