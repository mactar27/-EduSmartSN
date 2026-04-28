import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const etablissement_id = searchParams.get('etablissement_id');
    const filiere = searchParams.get('filiere');
    const statut = searchParams.get('statut');

    let sql = `
      SELECT e.*, u.email, u.first_name, u.last_name, u.phone, u.avatar_url,
             et.name as etablissement_name
      FROM etudiants e
      JOIN users u ON e.user_id = u.id
      JOIN etablissements et ON e.etablissement_id = et.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (etablissement_id) {
      sql += ' AND e.etablissement_id = ?';
      params.push(parseInt(etablissement_id));
    }

    if (filiere) {
      sql += ' AND e.filiere = ?';
      params.push(filiere);
    }

    if (statut) {
      sql += ' AND e.statut = ?';
      params.push(statut);
    }

    sql += ' ORDER BY e.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const etudiants = await query(sql, params);

    let countSql = 'SELECT COUNT(*) as total FROM etudiants WHERE 1=1';
    const countParams: (string | number)[] = [];

    if (etablissement_id) {
      countSql += ' AND etablissement_id = ?';
      countParams.push(parseInt(etablissement_id));
    }

    const [countResult] = await query<{ total: number }[]>(countSql, countParams);

    return NextResponse.json({
      data: etudiants,
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching etudiants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch etudiants' },
      { status: 500 }
    );
  }
}
