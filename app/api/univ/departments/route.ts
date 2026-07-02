import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');
    
    // In a real app, we'd get tenantId from session. 
    // Here we'll just fetch all or filter if provided.
    const departments = await prisma.department.findMany({
      where: tenantId ? { faculty: { tenantId } } : undefined,
      include: {
        faculty: true
      },
      orderBy: { name: 'asc' }
    });

    const formatted = departments.map(d => ({
      id: d.id,
      name: d.name,
      facultyName: d.faculty.name,
      fullName: `${d.name} (${d.faculty.name})`
    }));

    return NextResponse.json({
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}
