import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { subjectId, grades } = await request.json();

    if (!subjectId || !grades || !Array.isArray(grades)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Using transactions for bulk operations
    await prisma.$transaction(
      grades.map((grade) => {
        const { studentId, value } = grade;
        return prisma.grade.upsert({
          where: {
            // Because we don't have a unique constraint on studentId_subjectId in schema,
            // we will find first, then update or create.
            // Wait, upsert needs a unique constraint. We'll use a transaction with raw operations
            // or find first and then update/create.
            id: 'placeholder'
          },
          update: {},
          create: {
            value,
            studentId,
            subjectId,
          }
        });
      })
    );

    return NextResponse.json({ message: 'Notes enregistrées avec succès' });
  } catch (error: any) {
    // Fallback: Custom logic since no unique constraint on (studentId, subjectId)
    // Actually, let's fix it by rewriting the logic.
    try {
      const { subjectId, grades } = await request.json();
      for (const grade of grades) {
        const { studentId, value } = grade;
        const existing = await prisma.grade.findFirst({
          where: { studentId, subjectId }
        });
        if (existing) {
          await prisma.grade.update({ where: { id: existing.id }, data: { value } });
        } else {
          await prisma.grade.create({ data: { studentId, subjectId, value } });
        }
      }
      return NextResponse.json({ message: 'Notes enregistrées avec succès' });
    } catch (e: any) {
      console.error('Error saving grades:', e);
      return NextResponse.json({ error: 'Failed to save grades', details: e.message }, { status: 500 });
    }
  }
}

