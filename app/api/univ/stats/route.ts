import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const firstTenant = await prisma.tenant.findFirst({
        orderBy: { id: 'asc' }
      });
      
      if (!firstTenant) {
        // Auto-create a default tenant to unblock the UI if the database is fresh
        const defaultTenant = await prisma.tenant.create({
          data: {
            name: "EduSmart SN",
            subdomain: "edusmart-demo",
            domain: "demo.edusmart.sn",
            status: "ACTIVE"
          }
        });
        targetTenantId = defaultTenant.id;
      } else {
        targetTenantId = firstTenant.id;
      }
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

    // Fetch financial stats
    let totalDue = 0;
    let totalRevenue = 0;
    let soldePaytech = 0;
    let elevesAJour = 0;
    let impayes: any[] = [];
    let paymentsByMethod: any[] = [];

    try {
      // Get sum of all fees configured for this tenant
      const fees = await prisma.fee.aggregate({
        where: { tenantId: targetTenantId },
        _sum: { amount: true }
      });
      const expectedPerStudent = fees._sum.amount || 0;
      totalDue = expectedPerStudent * studentCount;

      // Group payments by method
      const groupedPayments = await prisma.payment.groupBy({
        by: ['method'],
        where: { 
          tenantId: targetTenantId,
          status: 'SUCCESS'
        },
        _sum: { amount: true }
      });
      
      paymentsByMethod = groupedPayments.map((p: any) => ({ method: p.method, total: p._sum.amount || 0 }));
      totalRevenue = paymentsByMethod.reduce((acc, curr) => acc + curr.total, 0);

      const paytechPayment = groupedPayments.find(p => p.method === 'PAYTECH_AUTO');
      if (paytechPayment) {
        soldePaytech = paytechPayment._sum.amount || 0;
      }

      // Calculate students status
      const students = await prisma.student.findMany({
        where: { tenantId: targetTenantId },
        include: {
          payments: {
            where: { status: 'SUCCESS' }
          },
          user: true
        }
      });

      for (const student of students) {
        const studentPaid = student.payments.reduce((acc, p) => acc + p.amount, 0);
        const reste = expectedPerStudent - studentPaid;
        
        if (reste <= 0 && expectedPerStudent > 0) {
          elevesAJour++;
        } else if (reste > 0) {
          impayes.push({
            id: student.id,
            name: student.name || student.user.name || 'Inconnu',
            department: student.department || 'Non assigné',
            reste,
            totalPaid: studentPaid,
            delay: '15 JOURS' // Mock delay for now
          });
        }
      }

      // Sort impayes by amount (highest first) and take top 10
      impayes.sort((a, b) => b.reste - a.reste);
      impayes = impayes.slice(0, 10);

    } catch (e) { console.error("Error computing financials:", e); }
    
    return NextResponse.json({
      tenant: tenant || { name: "EduSmart University", id: targetTenantId },
      stats: {
        students: studentCount || 0,
        enrollmentRate: "95%",
        totalRevenue,
        paymentsByMethod,
        reste_a_recouvrer: Math.max(0, totalDue - totalRevenue),
        solde_paytech: soldePaytech,
        eleves_a_jour: elevesAJour,
        eleves_a_jour_percent: studentCount > 0 ? Math.round((elevesAJour / studentCount) * 100) : 0,
        impayes
      }
    });
  } catch (error) {
    console.error('Error fetching univ stats:', error);
    return NextResponse.json({ error: 'Failed to fetch univ stats' }, { status: 500 });
  }
}
