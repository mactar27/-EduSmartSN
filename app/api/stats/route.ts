import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const etablissementsCount = await prisma.tenant.count({
      where: { status: 'ACTIVE' }
    });

    const etudiantsCount = await prisma.student.count();

    const professeursCount = await prisma.professor.count();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const paymentsAggregation = await prisma.payment.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: { gte: thirtyDaysAgo }
      },
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({
      total_etablissements: etablissementsCount || 0,
      total_etudiants: etudiantsCount || 0,
      total_professeurs: professeursCount || 0,
      paiements_mois: paymentsAggregation._sum.amount || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

