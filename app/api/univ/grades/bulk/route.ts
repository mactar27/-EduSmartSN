import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { subjectId, grades } = await request.json();

    if (!subjectId || !grades || !Array.isArray(grades)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    for (const grade of grades) {
      const { studentId, value } = grade;
      
      // Upsert grade using raw SQL on the legacy table
      // We check if a grade already exists for this student and subject
      const existing = await query<any[]>('SELECT id FROM notes WHERE student_id = ? AND subject_code = ?', [studentId, subjectId]);
      
      if (existing.length > 0) {
        await query('UPDATE notes SET value = ? WHERE id = ?', [value, existing[0].id]);
      } else {
        await query('INSERT INTO notes (student_id, subject_code, value) VALUES (?, ?, ?)', [studentId, subjectId, value]);
      }
    }

    return NextResponse.json({ message: 'Notes enregistrées avec succès' });
  } catch (error: any) {
    console.error('Error saving grades:', error);
    return NextResponse.json({ error: 'Failed to save grades', details: error.message }, { status: 500 });
  }
}
