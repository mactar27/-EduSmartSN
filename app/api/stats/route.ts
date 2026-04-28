import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const etablissementsResult = await query<any[]>('SELECT COUNT(*) as count FROM etablissements WHERE is_active = 1');
    const etudiantsResult = await query<any[]>('SELECT COUNT(*) as count FROM etudiants');
    const professeursResult = await query<any[]>('SELECT COUNT(*) as count FROM users WHERE role = "professor"');
    const paymentsResult = await query<any[]>('SELECT SUM(montant) as sum FROM paiements WHERE statut = "reussi" AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

    return NextResponse.json({
      total_etablissements: etablissementsResult[0]?.count || 0,
      total_etudiants: etudiantsResult[0]?.count || 0,
      total_professeurs: professeursResult[0]?.count || 0,
      paiements_mois: paymentsResult[0]?.sum || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
