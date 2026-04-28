import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json();
    
    // Pour l'instant, on prend le premier établissement actif comme tenant
    const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 LIMIT 1');
    const tenantId = tenants[0].id;

    for (const student of students) {
      await query(
        `INSERT INTO etudiants (name, email, student_id, department, etablissement_id, statut, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, 'actif', NOW(), NOW())`,
        [student.name, student.email || '', student.studentId, student.department, tenantId]
      );
    }

    return NextResponse.json({ message: `${students.length} élèves importés` });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'importation' }, { status: 500 });
  }
}
