import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // In a real app, you should use bcrypt to hash and compare passwords
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };

    const token = await createSessionCookie(sessionUser);

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: sessionUser
    });

    response.cookies.set({
      name: 'edusmart-session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion : ' + error.message }, { status: 500 });
  }
}
