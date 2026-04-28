import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const etablissements = await query<any[]>(
      `SELECT id, name, subdomain as slug FROM Tenant WHERE status = "ACTIVE" ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`
    );

    
    const countResult = await query<any[]>('SELECT COUNT(*) as total FROM Tenant WHERE status = "ACTIVE"');

    return NextResponse.json({
      data: etablissements.map(e => ({
        ...e,
        city: 'Sénégal',
        student_count: 0
      })),
      total: countResult[0]?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching etablissements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch etablissements' },
      { status: 500 }
    );
  }
}
