import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: { students: true }
          }
        }
      }),
      prisma.tenant.count({
        where: { status: 'ACTIVE' }
      })
    ]);

    return NextResponse.json({
      data: tenants.map(e => ({
        id: e.id,
        name: e.name,
        slug: e.subdomain,
        city: 'Sénégal', // Defaulting as city is not in schema
        student_count: e._count.students || 0,
        logo_url: e.logoUrl
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching etablissements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch etablissements' },
      { status: 500 }
    );
  }
}
