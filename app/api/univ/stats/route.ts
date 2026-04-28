import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    // For demo, if no tenantId, get the first active tenant
    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const tenants = await query<any[]>('SELECT id FROM Tenant WHERE status = "ACTIVE" LIMIT 1');
      if (tenants.length === 0) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
      }
      targetTenantId = tenants[0].id;
    }

    const tenant = await query<any[]>('SELECT * FROM Tenant WHERE id = ?', [targetTenantId]);
    const studentCount = await query<any[]>('SELECT COUNT(*) as count FROM Student WHERE tenantId = ?', [targetTenantId]);
    const payments = await query<any[]>('SELECT SUM(p.amount) as total, p.method FROM Payment p JOIN Student s ON p.studentId = s.id WHERE s.tenantId = ? AND p.status = "PAID" GROUP BY p.method', [targetTenantId]);
    
    // Recent activities (mocked but based on real tables)
    const recentEnrollments = await query<any[]>('SELECT COUNT(*) as count FROM Enrollment e JOIN Student s ON e.studentId = s.id WHERE s.tenantId = ?', [targetTenantId]);

    return NextResponse.json({
      tenant: tenant[0],
      stats: {
        students: studentCount[0]?.count || 0,
        enrollmentRate: recentEnrollments[0]?.count > 0 ? "95%" : "0%",
        totalRevenue: payments.reduce((acc: number, p: any) => acc + (p.total || 0), 0),
        paymentsByMethod: payments
      }
    });
  } catch (error) {
    console.error('Error fetching univ stats:', error);
    return NextResponse.json({ error: 'Failed to fetch univ stats' }, { status: 500 });
  }
}
