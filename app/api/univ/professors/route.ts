import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');
    
    let whereClause: any = {};
    if (tenantId) {
      whereClause.tenantId = tenantId;
    }

    const [professors, departmentsCount] = await Promise.all([
      prisma.professor.findMany({
        where: whereClause,
        include: {
          user: true
        }
      }),
      prisma.department.count({
        where: tenantId ? { faculty: { tenantId } } : undefined
      })
    ]);

    const formattedProfessors = professors.map(prof => ({
      id: prof.id,
      name: prof.user?.name || 'Inconnu',
      role: prof.user?.role || 'Professeur',
      department: prof.specialization || 'Général',
      email: prof.user?.email || '',
      phone: '', // Not in schema
      courses: 0, // Placeholder as we don't have direct ProfessorSubject link in schema yet
      status: 'Active',
      avatar: '/avatars/prof1.png'
    }));

    return NextResponse.json({
      data: formattedProfessors,
      stats: {
        totalProfessors: formattedProfessors.length,
        totalHours: "1,240h", // Placeholder
        departments: departmentsCount,
        occupancyRate: "88%" // Placeholder
      }
    });
  } catch (error) {
    console.error('Error fetching professors:', error);
    return NextResponse.json({ error: 'Failed to fetch professors' }, { status: 500 });
  }
}
