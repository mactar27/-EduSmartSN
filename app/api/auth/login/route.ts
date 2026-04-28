import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Debug temporaire pour voir les colonnes
    const cols: any = await query('DESCRIBE users');
    
    // Tentative avec le nom probable 'mot_de_passe' ou similar
    const passwordField = cols.find((c: any) => 
      c.Field.toLowerCase().includes('pass') || 
      c.Field.toLowerCase().includes('mot')
    ).Field;
    
    const users = await query<any[]>(`SELECT * FROM users WHERE email = ? AND ${passwordField} = ?`, [email, password]);

    if (users.length === 0) {
      const count: any = await query('SELECT COUNT(*) as total FROM users');
      return NextResponse.json({ 
        error: `Identifiants incorrects (Users en base : ${count[0].total})` 
      }, { status: 401 });
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
