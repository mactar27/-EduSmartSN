import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const users = await query<any[]>('SELECT * FROM User WHERE email = ? AND password = ?', [email, password]);

    if (users.length === 0) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const user = users[0];

    // For a real app, we would set a session cookie here.
    // For this demo, we'll just return the user data and redirect client-side.

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}
