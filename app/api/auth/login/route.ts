import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Utilisation de la table 'users' et de la colonne 'password_hash' identifiée
    const users = await query<any[]>('SELECT * FROM users WHERE email = ? AND password_hash = ?', [email, password]);

    if (users.length === 0) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const user = users[0];

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.etablissement_id // Alignement probable sur le schéma FR
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion : ' + error.message }, { status: 500 });
  }
}
