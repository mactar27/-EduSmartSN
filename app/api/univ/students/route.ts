import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 LIMIT 1');
      if (tenants.length === 0) {
        return NextResponse.json({ data: [] });
      }
      targetTenantId = tenants[0].id;
    }

    const students = await query<any[]>(
      'SELECT * FROM etudiants WHERE etablissement_id = ? ORDER BY name ASC',
      [targetTenantId]
    );

    return NextResponse.json({ data: students });
  } catch (error: any) {
    console.error('Detailed Error fetching students:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch students', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, studentId, department, photoUrl, birthDate } = body;

    const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 LIMIT 1');
    const tenantId = tenants[0].id;

    // 1. Create the Student profile directly (we'll link to users later if needed)
    const result = await query<any>(
      'INSERT INTO etudiants (name, email, student_id, department, photo_url, etablissement_id, statut, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, "actif", NOW(), NOW())',
      [name, `${studentId.toLowerCase()}@wockytech.xyz`, studentId, department, photoUrl, tenantId]
    );

    return NextResponse.json({ message: 'Student created successfully', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
