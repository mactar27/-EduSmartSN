import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Insérer le Super Admin (Mactar)
    // Note : On met le mot de passe en brut dans 'password_hash' pour le test initial
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      ['ndiayeamadoumactar3@gmail.com', 'M@tzo2705', 'Amadou Mactar', 'Ndiaye', 'SUPER_ADMIN']
    );

    return NextResponse.json({ 
      status: "Succès !", 
      message: "Compte Super Admin créé pour ndiayeamadoumactar3@gmail.com. Vous pouvez maintenant vous connecter." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Erreur lors du seeding", 
      message: error.message 
    }, { status: 500 });
  }
}
