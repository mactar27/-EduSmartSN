import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let tenantId = searchParams.get('tenantId');
    
    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' }
      });
      if (tenant) tenantId = tenant.id;
    }

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, tenantId: bodyTenantId } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let tenantId = bodyTenantId;
    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' }
      });
      if (!tenant) return NextResponse.json({ error: 'No active tenant found' }, { status: 404 });
      tenantId = tenant.id;
    }

    // Check if Faculty exists, if not create 'Faculté Générale'
    let faculty = await prisma.faculty.findFirst({
      where: { tenantId }
    });

    if (!faculty) {
      faculty = await prisma.faculty.create({
        data: {
          name: 'Faculté Générale',
          tenantId
        }
      });
    }

    const department = await prisma.department.create({
      data: {
        name,
        facultyId: faculty.id
      }
    });

    return NextResponse.json({ data: department }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
