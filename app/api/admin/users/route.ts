import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const users = await query<any[]>(`
      SELECT u.*, t.name as tenant_name 
      FROM User u 
      LEFT JOIN Tenant t ON u.tenantId = t.id 
      ORDER BY u.createdAt DESC
    `);
    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
