import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(user: { id: string; email: string; name: string | null }, role: 'admin' | 'member' = 'admin') {
  const session = await encrypt({ id: user.id, email: user.email, name: user.name, role });
  const cookieName = role === 'admin' ? 'session' : 'member-session';
  
  (await cookies()).set(cookieName, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

export async function logout(role: 'admin' | 'member' = 'admin') {
  const cookieName = role === 'admin' ? 'session' : 'member-session';
  (await cookies()).set(cookieName, '', { expires: new Date(0), path: '/' });
}

export async function getSession(role: 'admin' | 'member' = 'admin') {
  const cookieName = role === 'admin' ? 'session' : 'member-session';
  const session = (await cookies()).get(cookieName)?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
