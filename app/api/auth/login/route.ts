import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionCookie } from '@/lib/auth';

import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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
