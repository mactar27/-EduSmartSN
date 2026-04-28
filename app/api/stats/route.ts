import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const etablissementsResult = await query<any[]>('SELECT COUNT(*) as count FROM Tenant WHERE status = "ACTIVE"');
    const etudiantsResult = await query<any[]>('SELECT COUNT(*) as count FROM Student');
    const professeursResult = await query<any[]>('SELECT COUNT(*) as count FROM Professor');
    const paymentsResult = await query<any[]>('SELECT SUM(amount) as sum FROM Payment WHERE status = "PAID" AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

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
