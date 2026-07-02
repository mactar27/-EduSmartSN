import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filiere = searchParams.get('filiere');

    const whereClause: any = {};
    
    if (filiere && filiere !== 'all') {
      whereClause.department = { name: filiere };
    }

    const ues = await prisma.unitOfTeaching.findMany({
      where: whereClause,
      include: {
        department: true,
        subjects: true
      },
      orderBy: { name: 'asc' }
    });

    const formattedData = ues.map(ue => ({
      id: ue.id,
      name: ue.name,
      code: ue.code,
      filiere: ue.department?.name || 'Général',
      credits: ue.credits, // or sum of subjects credits
      subjects: ue.subjects.map(s => ({
        id: s.id,
        name: s.name,
        code: s.code,
        credits: s.credits,
        coefficient: s.coefficient
      }))
    }));

    return NextResponse.json({
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching cours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cours' },
      { status: 500 }
    );
  }
}

