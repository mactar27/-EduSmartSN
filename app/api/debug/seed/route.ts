import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Créer un établissement par défaut
    await query(
      `INSERT INTO etablissements (name, slug, city, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      ['EduSmart University', 'edusmart-univ', 'Dakar', 1]
    );

    const [tenant]: any = await query("SELECT id FROM etablissements WHERE slug = 'edusmart-univ' LIMIT 1");
    const tenantId = tenant.id;

    // 2. Créer le Super Admin (Mactar)
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, etablissement_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['ndiayeamadoumactar3@gmail.com', 'M@tzo2705', 'Amadou Mactar', 'Ndiaye', 'super_admin', tenantId]
    );

    return NextResponse.json({ 
      status: "Succès !", 
      message: "Etablissement et Compte Super Admin créés. Vous pouvez vous connecter !" 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Erreur lors du seeding", 
      message: error.message 
    }, { status: 500 });
  }
}
