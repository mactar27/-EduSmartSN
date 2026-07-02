import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const etablissement_id = searchParams.get('etablissement_id');
    const filiere = searchParams.get('filiere');
    // Note: status is not in the Prisma Student model currently, we'll ignore it or map it if it exists.

    const whereClause: any = {};
    if (etablissement_id) {
      whereClause.tenantId = etablissement_id;
    }
    if (filiere) {
      whereClause.department = filiere; // Mapping filiere to department
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
        include: {
          user: true,
          tenant: true
        },
        orderBy: { user: { createdAt: 'desc' } }, // Assuming we order by user creation
        skip: offset,
        take: limit
      }),
      prisma.student.count({ where: whereClause })
    ]);

    const formattedStudents = students.map(student => ({
      ...student,
      email: student.user?.email,
      first_name: student.name || student.user?.name,
      last_name: '', // We only have 'name' in Prisma, so we map it to first_name
      phone: '', // Not in new schema
      avatar_url: student.photoUrl,
      etablissement_name: student.tenant?.name
    }));

    return NextResponse.json({
      data: formattedStudents,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching etudiants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch etudiants' },
      { status: 500 }
    );
  }
}

