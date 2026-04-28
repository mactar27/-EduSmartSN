import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const etablissements = await query<any[]>(
      `SELECT id, name, slug, logo_url, ville, student_count FROM etablissements WHERE is_active = 1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    const countResult = await query<any[]>('SELECT COUNT(*) as total FROM etablissements WHERE is_active = 1');

    return NextResponse.json({
      data: etablissements.map(e => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        city: e.ville || 'Sénégal',
        student_count: e.student_count || 0,
        logo_url: e.logo_url
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
