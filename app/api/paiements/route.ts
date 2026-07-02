import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const etablissement_id = searchParams.get('etablissement_id');
    const statut = searchParams.get('statut');
    const methode = searchParams.get('methode');

    const whereClause: any = {};
    if (etablissement_id) whereClause.tenantId = etablissement_id;
    if (statut) whereClause.status = statut === 'complete' ? 'PAID' : (statut.toUpperCase() as PaymentStatus);
    if (methode) whereClause.method = methode;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: whereClause,
        include: {
          student: {
            include: { user: true }
          },
          tenant: true
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.payment.count({ where: whereClause })
    ]);

    // Group by method totals (simple approximation since Prisma groupBy is limited)
    const totalsByMethodRaw = await prisma.payment.groupBy({
      by: ['method'],
      where: { status: 'PAID' },
      _sum: { amount: true },
      _count: true
    });

    const totals_by_method = totalsByMethodRaw.map(t => ({
      methode: t.method,
      total: t._sum.amount || 0,
      count: t._count
    }));

    const formattedPayments = payments.map(p => ({
      ...p,
      etudiant_name: p.student?.name || p.student?.user?.name || 'Inconnu',
      matricule: p.student?.studentId || '',
      etablissement_name: p.tenant?.name || '',
      statut: p.status === 'PAID' ? 'complete' : p.status.toLowerCase(), // mapping back for frontend
      methode: p.method,
      montant: p.amount
    }));

    return NextResponse.json({
      data: formattedPayments,
      totals_by_method,
      total,
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

    if (!etudiant_id || !etablissement_id || !montant || !methode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await prisma.payment.create({
      data: {
        studentId: etudiant_id,
        tenantId: etablissement_id,
        amount: parseFloat(montant),
        method: methode,
        status: 'PENDING',
        reference: transactionId
      }
    });

    return NextResponse.json({ reference: transactionId, message: 'Paiement created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating paiement:', error);
    return NextResponse.json(
      { error: 'Failed to create paiement' },
      { status: 500 }
    );
  }
}

