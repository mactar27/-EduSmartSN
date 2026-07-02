import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch demo request
    const demo = await prisma.demoRequest.findUnique({ where: { id } });
    if (!demo) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }

    // 2. Create Etablissement (Tenant)
    const subdomain = demo.etablissementName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newTenant = await prisma.tenant.create({
      data: {
        name: demo.etablissementName,
        subdomain,
        primaryColor: "#4f46e5",
        secondaryColor: "#6366f1",
        status: "ACTIVE"
      }
    });

    const etablissementId = newTenant.id;

    // 3. Create or Link Admin User
    let tempPassword = "Mot de passe existant";
    const existingUser = await prisma.user.findUnique({ where: { email: demo.email } });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          tenantId: etablissementId,
          role: 'UNIV_ADMIN' // Adjusting to the Prisma UserRole enum
        }
      });
    } else {
      tempPassword = Math.random().toString(36).slice(-8);
      await prisma.user.create({
        data: {
          email: demo.email,
          password: tempPassword,
          name: demo.contactName,
          role: 'UNIV_ADMIN',
          tenantId: etablissementId
        }
      });
    }

    // 4. Send Welcome Email
    try {
      const { data, error: mailError } = await resend.emails.send({
        from: 'EduSmart SN <bienvenue@wockytech.xyz>',
        to: demo.email,
        subject: `Bienvenue sur EduSmart SN - Activation de votre espace ${demo.etablissementName}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #4f46e5; padding: 40px; text-align: center;">
              <img src="https://edusmartsn.vercel.app/logo.png" alt="EduSmart SN" style="height: 60px; width: auto;">
            </div>
            <div style="padding: 40px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0;">Félicitations, ${demo.contactName} !</h2>
              <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                Votre demande pour l'établissement <strong>${demo.etablissementName}</strong> a été approuvée. 
                Votre plateforme de gestion scolaire est désormais prête.
              </p>
              
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Vos identifiants de connexion</h3>
                <p style="margin: 8px 0; font-size: 16px; color: #0f172a;"><strong>Email :</strong> ${demo.email}</p>
                <p style="margin: 8px 0; font-size: 16px; color: #0f172a;"><strong>Mot de passe temporaire :</strong> <span style="background-color: #fbbf24; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="https://edusmartsn.vercel.app/login" style="background-color: #4f46e5; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.5);">
                  Accéder au Dashboard
                </a>
              </div>
              
              <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 40px;">
                © 2026 EduSmart SN - La souveraineté numérique pour l'éducation au Sénégal.
              </p>
            </div>
          </div>
        `,
      });

      if (mailError) {
        console.error("Resend Error:", mailError);
      } else {
        console.log("Resend Success:", data);
      }
    } catch (err) {
      console.error("Critical Mail Error:", err);
    }

    // 5. Mark as processed (Delete since we don't have a status field)
    await prisma.demoRequest.delete({ where: { id } });

    return NextResponse.json({ message: 'Demande acceptée avec succès', etablissementId });
  } catch (error: any) {
    console.error('Erreur lors de l\'approbation:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'approbation : ' + error.message }, { status: 500 });
  }
}

