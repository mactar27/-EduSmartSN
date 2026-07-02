import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-edusmart-sn-super-secure-key';

export async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/univ');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/univ');
  
  if (!isApiRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('edusmart-session')?.value;

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const user = verified.payload as any;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);
    requestHeaders.set('x-tenant-id', user.tenantId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/univ/:path*', '/api/univ/:path*'],
};
