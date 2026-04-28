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
    const requests = await query<any[]>('SELECT * FROM demandes_demo WHERE id = ?', [id]);
    if (requests.length === 0) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }
    const demo = requests[0];

    // 2. Create Etablissement (University)
    const subdomain = demo.etablissement_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    await query(
      `INSERT INTO etablissements (name, slug, city, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, 1, NOW(), NOW())`,
      [demo.etablissement_name, subdomain, 'Dakar']
    );

    // Get the generated ID
    const [newEtab]: any = await query('SELECT id FROM etablissements WHERE slug = ? LIMIT 1', [subdomain]);
    const etablissementId = newEtab.id;

    // 3. Create or Link Admin User
    const existingUsers = await query<any[]>('SELECT id FROM users WHERE email = ?', [demo.email]);
    let userId;
    let tempPassword = "Mot de passe existant";

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      await query(
        'UPDATE users SET etablissement_id = ?, role = "admin_university", updated_at = NOW() WHERE id = ?',
        [etablissementId, userId]
      );
    } else {
      tempPassword = Math.random().toString(36).slice(-8);
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, etablissement_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, 'admin_university', ?, NOW(), NOW())`,
        [demo.email, tempPassword, demo.contact_name, '', etablissementId]
      );
    }

    // 4. Send Welcome Email
    try {
      await resend.emails.send({
        from: 'EduSmart SN <onboarding@resend.dev>',
        to: demo.email,
        subject: `Bienvenue sur EduSmart SN - Activation de votre espace ${demo.etablissement_name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #4f46e5; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -1px;">EDUSMART <span style="color: #ffffff; opacity: 0.8;">SN</span></h1>
            </div>
            <div style="padding: 40px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0;">Félicitations, ${demo.contact_name} !</h2>
              <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                Votre demande pour l'établissement <strong>${demo.etablissement_name}</strong> a été approuvée. 
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
    } catch (mailError) {
      console.warn("Mail failed but DB actions succeeded");
    }

    // 5. Mark as processed (Update status instead of delete)
    await query('UPDATE demandes_demo SET statut = "convertie", updated_at = NOW() WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Demande acceptée avec succès', etablissementId });
  } catch (error: any) {
    console.error('Erreur lors de l\'approbation:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'approbation : ' + error.message }, { status: 500 });
  }
}
