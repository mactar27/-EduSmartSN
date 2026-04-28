import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const etablissement_id = searchParams.get('etablissement_id');
    const statut = searchParams.get('statut');
    const methode = searchParams.get('methode');

    let sql = `
      SELECT p.*, 
             CONCAT(u.first_name, ' ', u.last_name) as etudiant_name,
             e.matricule,
             et.name as etablissement_name
      FROM paiements p
      JOIN etudiants e ON p.etudiant_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN etablissements et ON p.etablissement_id = et.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (etablissement_id) {
      sql += ' AND p.etablissement_id = ?';
      params.push(parseInt(etablissement_id));
    }

    if (statut) {
      sql += ' AND p.statut = ?';
      params.push(statut);
    }

    if (methode) {
      sql += ' AND p.methode = ?';
      params.push(methode);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const paiements = await query(sql, params);

    // Get totals by method
    const totals = await query<{ methode: string; total: number; count: number }[]>(`
      SELECT methode, SUM(montant) as total, COUNT(*) as count
      FROM paiements
      WHERE statut = 'complete'
      GROUP BY methode
    `);

    const [countResult] = await query<{ total: number }[]>(
      'SELECT COUNT(*) as total FROM paiements'
    );

    return NextResponse.json({
      data: paiements,
      totals_by_method: totals,
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching paiements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paiements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { etudiant_id, etablissement_id, montant, type, methode, description } = body;

    if (!etudiant_id || !etablissement_id || !montant || !type || !methode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await query(
      `INSERT INTO paiements (reference, etudiant_id, etablissement_id, montant, type, methode, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [reference, etudiant_id, etablissement_id, montant, type, methode, description || null]
    );

    return NextResponse.json({ reference, message: 'Paiement created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating paiement:', error);
    return NextResponse.json(
      { error: 'Failed to create paiement' },
      { status: 500 }
    );
  }
}
