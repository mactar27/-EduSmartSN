import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const etablissement_id = searchParams.get('etablissement_id');
    const filiere = searchParams.get('filiere');
    const niveau = searchParams.get('niveau');

    let sql = `
      SELECT c.*, et.name as etablissement_name,
             CONCAT(u.first_name, ' ', u.last_name) as professor_name
      FROM cours c
      JOIN etablissements et ON c.etablissement_id = et.id
      LEFT JOIN users u ON c.professor_id = u.id
      WHERE c.is_active = TRUE
    `;
    const params: (string | number)[] = [];

    if (etablissement_id) {
      sql += ' AND c.etablissement_id = ?';
      params.push(parseInt(etablissement_id));
    }

    if (filiere) {
      sql += ' AND c.filiere = ?';
      params.push(filiere);
    }

    if (niveau) {
      sql += ' AND c.niveau = ?';
      params.push(niveau);
    }

    sql += ' ORDER BY c.code ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const cours = await query(sql, params);

    const [countResult] = await query<{ total: number }[]>(
      'SELECT COUNT(*) as total FROM cours WHERE is_active = TRUE'
    );

    return NextResponse.json({
      data: cours,
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching cours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cours' },
      { status: 500 }
    );
  }
}
