import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json();
    console.log(`Starting import of ${students?.length} students`);
    
    // On récupère l'établissement actif via Prisma
    const tenant = await prisma.tenant.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    });
    
    if (!tenant) {
      return NextResponse.json({ error: 'Aucun établissement actif trouvé' }, { status: 404 });
    }
    const tenantId = tenant.id;
    console.log(`Targeting tenant ID: ${tenantId}`);

    let successCount = 0;
    for (const student of students) {
      try {
        const matricule = student.studentId || `SN-${Math.random().toString(36).slice(-5).toUpperCase()}`;
        const email = student.email || `${matricule.toLowerCase()}@edusmart.sn`;
        const tempPassword = 'password123'; // Password temporaire standard

        // Utilisation de Prisma pour créer le User et le Student lié en une seule transaction
        await prisma.user.create({
          data: {
            name: student.name,
            email: email,
            role: 'STUDENT',
            password: tempPassword, // TODO: utiliser bcrypt pour hasher
            tenantId: tenantId,
            studentProfile: {
              create: {
                studentId: matricule,
                name: student.name,
                department: student.department || 'Général',
                tenantId: tenantId
              }
            }
          }
        });
        
        // Envoi de l'email de bienvenue avec les identifiants
        if (process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: 'EduSmart <onboarding@resend.dev>', // TODO: Remplacer par un domaine validé
            to: [email],
            subject: 'Bienvenue sur EduSmart - Vos identifiants de connexion',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">Bienvenue sur EduSmart, ${student.name} !</h2>
                <p>Votre établissement (${tenant.name}) vient de vous inscrire sur la plateforme souveraine EduSmart.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Voici vos identifiants de connexion :</strong></p>
                  <p>Email : <strong>${email}</strong></p>
                  <p>Mot de passe temporaire : <strong>${tempPassword}</strong></p>
                </div>
                <p>Veuillez vous connecter et changer votre mot de passe le plus rapidement possible.</p>
                <a href="https://edusmartsn.vercel.app/login" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder à mon espace</a>
              </div>
            `
          });
        }
        
        successCount++;
      } catch (err) {
        console.error(`Failed to insert student ${student.name}:`, err);
      }
    }

    console.log(`Import finished: ${successCount} successes`);
    return NextResponse.json({ 
      message: `${successCount} élèves importés avec succès (Emails envoyés)`,
      count: successCount 
    });
  } catch (error: any) {
    console.error('Critical Import error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'importation', details: error.message }, { status: 500 });
  }
}
