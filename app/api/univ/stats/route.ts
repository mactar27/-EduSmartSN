import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    // For demo, if no tenantId, get the first active tenant
    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 LIMIT 1');
      if (tenants.length === 0) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
      }
      targetTenantId = tenants[0].id;
    }

    const tenant = await query<any[]>('SELECT * FROM etablissements WHERE id = ?', [targetTenantId]);
    const studentCount = await query<any[]>('SELECT COUNT(*) as count FROM etudiants WHERE etablissement_id = ? AND statut = "actif"', [targetTenantId]);
    const payments = await query<any[]>('SELECT SUM(montant) as total, methode FROM paiements WHERE etablissement_id = ? AND statut = "SUCCESS" GROUP BY methode', [targetTenantId]);
    
    return NextResponse.json({
      tenant: tenant[0],
      stats: {
        students: studentCount[0]?.count || 0,
        enrollmentRate: "95%",
        totalRevenue: payments.reduce((acc: number, p: any) => acc + (p.total || 0), 0),
        paymentsByMethod: payments.map((p: any) => ({ method: p.methode, total: p.total }))
      }
    });
  } catch (error) {
    console.error('Error fetching univ stats:', error);
    return NextResponse.json({ error: 'Failed to fetch univ stats' }, { status: 500 });
  }
}
