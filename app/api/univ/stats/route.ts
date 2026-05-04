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
      const tenants = await query<any[]>('SELECT id FROM etablissements ORDER BY id ASC LIMIT 1');
      if (tenants.length === 0) {
        return NextResponse.json({
          tenant: { name: "EduSmart SN", id: 0 },
          stats: { students: 0, enrollmentRate: "0%", totalRevenue: 0, paymentsByMethod: [] }
        });
      }
      targetTenantId = tenants[0].id;
    }

    const tenant = await query<any[]>('SELECT * FROM etablissements WHERE id = ?', [targetTenantId]);
    
    let studentCount = [{ count: 0 }];
    try {
      studentCount = await query<any[]>('SELECT COUNT(*) as count FROM etudiants WHERE etablissement_id = ? AND statut = "actif"', [targetTenantId]);
    } catch (e) { console.error("Missing etudiants table?"); }

    let payments: any[] = [];
    try {
      payments = await query<any[]>('SELECT SUM(montant) as total, methode FROM paiements WHERE etablissement_id = ? AND statut = "SUCCESS" GROUP BY methode', [targetTenantId]);
    } catch (e) { console.error("Missing paiements table?"); }
    
    return NextResponse.json({
      tenant: tenant[0] || { name: "EduSmart University", id: targetTenantId },
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
