import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma'; // We'll use prisma for complex stuff if it works, or raw query

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;


    // 1. Fetch demo request
    const requests = await query<any[]>('SELECT * FROM DemoRequest WHERE id = ?', [id]);
    if (requests.length === 0) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }
    const demo = requests[0];

    // 2. Create Tenant (University)
    const tenantId = crypto.randomUUID();
    const subdomain = demo.etablissementName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    await query(
      `INSERT INTO Tenant (id, name, subdomain, domain, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, 'ACTIVE', NOW(), NOW())`,
      [tenantId, demo.etablissementName, subdomain, `${subdomain}.edusmart.sn`]
    );

    // 3. Create or Link Admin User for the Tenant
    const existingUsers = await query<any[]>('SELECT id FROM User WHERE email = ?', [demo.email]);
    let userId;
    let tempPassword = "Mot de passe existant";

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      // Update existing user to be linked to this tenant (if they don't have one)
      await query(
        'UPDATE User SET tenantId = ?, role = "UNIV_ADMIN", updatedAt = NOW() WHERE id = ?',
        [tenantId, userId]
      );
    } else {
      userId = crypto.randomUUID();
      tempPassword = Math.random().toString(36).slice(-8);
      await query(
        `INSERT INTO User (id, email, password, name, role, tenantId, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, 'UNIV_ADMIN', ?, NOW(), NOW())`,
        [userId, demo.email, tempPassword, demo.contactName, tenantId]
      );
    }


    // 4. Send Welcome Email
    await resend.emails.send({
      from: 'EduSmart SN <onboarding@resend.dev>',
      to: demo.email,
      subject: `Bienvenue sur EduSmart SN - Activation de votre espace ${demo.etablissementName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -1px;">EDUSMART <span style="color: #3b82f6;">SN</span></h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0;">Félicitations, ${demo.contactName} !</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              Votre demande pour l'établissement <strong>${demo.etablissementName}</strong> a été approuvée par notre équipe. 
              Votre plateforme souveraine de gestion scolaire est désormais prête.
            </p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Vos identifiants de connexion</h3>
              <p style="margin: 8px 0; font-size: 16px; color: #0f172a;"><strong>Email :</strong> ${demo.email}</p>
              <p style="margin: 8px 0; font-size: 16px; color: #0f172a;"><strong>Mot de passe temporaire :</strong> <span style="background-color: #fbbf24; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://edusmartsn.vercel.app/login" style="background-color: #3b82f6; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);">
                Accéder au Dashboard
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 40px;">
              Par sécurité, veuillez changer votre mot de passe lors de votre première connexion.<br>
              © 2026 EduSmart SN - La souveraineté numérique pour l'éducation au Sénégal.
            </p>
          </div>
        </div>
      `,
    });


    // 5. Delete or mark as processed (optional, here we delete for simplicity)
    await query('DELETE FROM DemoRequest WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Demande acceptée avec succès', tenantId });
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'approbation' }, { status: 500 });
  }
}
