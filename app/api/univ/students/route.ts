import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const tenants = await query<any[]>('SELECT id FROM Tenant WHERE status = "ACTIVE" LIMIT 1');
      if (tenants.length === 0) {
        return NextResponse.json({ data: [] });
      }
      targetTenantId = tenants[0].id;
    }

    const students = await query<any[]>(
      'SELECT * FROM Student WHERE tenantId = ? ORDER BY name ASC',
      [targetTenantId]
    );

    return NextResponse.json({ data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, studentId, department, photoUrl, birthDate } = body;

    // Get current tenant (for demo, use the first one)
    const tenants = await query<any[]>('SELECT id FROM Tenant WHERE status = "ACTIVE" LIMIT 1');
    const tenantId = tenants[0].id;

    // 1. Create a User for the student
    const userId = crypto.randomUUID();
    const email = `${studentId.toLowerCase()}@edusmart.sn`;
    await query(
      'INSERT INTO User (id, email, password, name, role, tenantId, createdAt, updatedAt) VALUES (?, ?, ?, ?, "STUDENT", ?, NOW(), NOW())',
      [userId, email, 'student123', name, tenantId]
    );

    // 2. Create the Student profile
    const id = crypto.randomUUID();
    await query(
      'INSERT INTO Student (id, userId, studentId, name, photoUrl, department, birthDate, tenantId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, userId, studentId, name, photoUrl, department, birthDate, tenantId]
    );

    return NextResponse.json({ message: 'Student created successfully', id }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
