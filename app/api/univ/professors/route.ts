import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
      courses: 0, // Placeholder
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, specialization, tenantId: bodyTenantId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Un utilisateur avec cet email existe déjà' }, { status: 400 });
    }

    // Create a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'PROFESSOR',
        tenantId,
        professorProfile: {
          create: {
            specialization: specialization || 'Général',
            tenantId
          }
        }
      },
      include: {
        professorProfile: true
      }
    });

    // In a real application, send the email here.
    // await sendEmail(email, 'Vos identifiants', `Mot de passe: ${tempPassword}`);
    
    return NextResponse.json({ 
      data: user,
      message: 'Professeur créé avec succès',
      tempPassword // Returning just for demonstration to the UI
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating professor:', error);
    return NextResponse.json(
      { error: 'Failed to create professor' },
      { status: 500 }
    );
  }
}
