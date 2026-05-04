import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' }
      });
      if (!tenant) {
        return NextResponse.json({ data: [], count: 0, warning: "NO_ACTIVE_TENANT" });
      }
      tenantId = tenant.id;
    }

    const students = await prisma.student.findMany({
      where: { tenantId },
      include: { user: true },
      orderBy: { name: 'asc' }
    });

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: s.name || s.user?.name || "Élève Sans Nom",
      email: s.user?.email || "---",
      studentId: s.studentId,
      department: s.department || "---",
      statut: "actif" // Status can be added to Prisma schema later if needed
    }));

    return NextResponse.json({ 
      data: formattedStudents,
      count: formattedStudents.length
    });
  } catch (error: any) {
    console.error("Prisma Fetch Error:", error);
    return NextResponse.json({ 
      error: 'PRISMA_ERROR', 
      message: error.message,
      data: [],
      count: 0
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, studentId, department, photoUrl } = body;

    const tenant = await prisma.tenant.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    });
    
    if (!tenant) {
      return NextResponse.json({ error: 'No active tenant found' }, { status: 404 });
    }

    const email = `${studentId.toLowerCase()}@wockytech.xyz`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'password123', // En production, il faut hasher ce mot de passe
        role: 'STUDENT',
        tenantId: tenant.id,
        studentProfile: {
          create: {
            studentId,
            name,
            department,
            photoUrl,
            tenantId: tenant.id
          }
        }
      }
    });

    return NextResponse.json({ message: 'Élève créé avec succès', id: user.id }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student', details: error.message }, { status: 500 });
  }
}
