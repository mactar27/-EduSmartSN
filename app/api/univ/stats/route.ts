import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    // For demo, if no tenantId, get the first active tenant
    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const firstTenant = await prisma.tenant.findFirst({
        orderBy: { id: 'asc' }
      });
      
      if (!firstTenant) {
        return NextResponse.json({
          tenant: { name: "EduSmart SN", id: "" },
          stats: { students: 0, enrollmentRate: "0%", totalRevenue: 0, paymentsByMethod: [] }
        });
      }
      targetTenantId = firstTenant.id;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: targetTenantId }
    });
    
    let studentCount = 0;
    try {
      studentCount = await prisma.student.count({
        where: { tenantId: targetTenantId }
      });
    } catch (e) { console.error("Error fetching students:", e); }

    let payments: any[] = [];
    try {
      payments = await prisma.payment.groupBy({
        by: ['method'],
        where: { 
          tenantId: targetTenantId,
          status: 'PAID'
        },
        _sum: {
          amount: true
        }
      });
    } catch (e) { console.error("Error fetching payments:", e); }
    
    return NextResponse.json({
      tenant: tenant || { name: "EduSmart University", id: targetTenantId },
      stats: {
        students: studentCount || 0,
        enrollmentRate: "95%",
        totalRevenue: payments.reduce((acc: number, p: any) => acc + (p._sum.amount || 0), 0),
        paymentsByMethod: payments.map((p: any) => ({ method: p.method, total: p._sum.amount || 0 }))
      }
    });
  } catch (error) {
    console.error('Error fetching univ stats:', error);
    return NextResponse.json({ error: 'Failed to fetch univ stats' }, { status: 500 });
  }
}
