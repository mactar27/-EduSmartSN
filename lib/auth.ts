import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-edusmart-sn-super-secure-key';

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edusmart-session')?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return { user: verified.payload as any };
  } catch (err) {
    return null;
  }
}

export async function createSessionCookie(user: any) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));
    
  return token;
}
