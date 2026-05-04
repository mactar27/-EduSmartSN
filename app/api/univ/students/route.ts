import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { name, email, studentId, department, photoUrl } = body;

    const tenant = await prisma.tenant.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    });
    
    if (!tenant) {
      return NextResponse.json({ error: 'No active tenant found' }, { status: 404 });
    }

    const finalEmail = email || `${studentId.toLowerCase()}@wockytech.xyz`;
    const tempPassword = 'password123';

    const user = await prisma.user.create({
      data: {
        name,
        email: finalEmail,
        password: tempPassword, // En production, il faut hasher ce mot de passe
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

    // Envoi de l'email de bienvenue
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'EduSmart <onboarding@resend.dev>',
          to: [finalEmail],
          subject: 'Bienvenue sur EduSmart - Vos identifiants de connexion',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4f46e5;">Bienvenue sur EduSmart, ${name} !</h2>
              <p>Votre établissement (${tenant.name}) vient de finaliser votre inscription.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Voici vos identifiants de connexion :</strong></p>
                <p>Email : <strong>${finalEmail}</strong></p>
                <p>Mot de passe temporaire : <strong>${tempPassword}</strong></p>
              </div>
              <p>Veuillez vous connecter et changer votre mot de passe le plus rapidement possible.</p>
              <a href="https://edusmartsn.vercel.app/login" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder à mon espace</a>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    return NextResponse.json({ message: 'Élève créé avec succès', id: user.id }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student', details: error.message }, { status: 500 });
  }
}
