import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const etablissement_id = searchParams.get('etablissement_id');
    const filiere = searchParams.get('filiere');
    const niveau = searchParams.get('niveau');

    const whereClause: any = {};
    if (etablissement_id) {
      // In Prisma schema, Subject doesn't directly link to Tenant. 
      // It links to UnitOfTeaching -> Department -> Faculty -> Tenant
      whereClause.ue = {
        department: {
          faculty: {
            tenantId: etablissement_id
          }
        }
      };
    }
    
    if (filiere) {
      if (whereClause.ue) {
        whereClause.ue.department = { ...whereClause.ue.department, name: filiere };
      } else {
        whereClause.ue = { department: { name: filiere } };
      }
    }

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where: whereClause,
        include: {
          ue: {
            include: {
              department: {
                include: {
                  faculty: {
                    include: { tenant: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { code: 'asc' },
        skip: offset,
        take: limit
      }),
      prisma.subject.count({ where: whereClause })
    ]);

    const formattedSubjects = subjects.map(s => ({
      id: s.id,
      code: s.code,
      name: s.name,
      credits: s.credits,
      coefficient: s.coefficient,
      etablissement_name: s.ue?.department?.faculty?.tenant?.name || '',
      professor_name: '', // Subject doesn't have professor directly in new schema without ProfessorSubject relation
      filiere: s.ue?.department?.name || '',
      niveau: '' // Not in schema
    }));

    return NextResponse.json({
      data: formattedSubjects,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching cours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cours' },
      { status: 500 }
    );
  }
}

