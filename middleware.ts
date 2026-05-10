import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Admin protection
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isAdminLoginPath = path === '/admin/login';

  // Portal protection
  const isPortalPath = path.startsWith('/portal') && !path.startsWith('/portal/login') && !path.startsWith('/portal/signup');
  const isPortalAuthPath = path === '/portal/login' || path === '/portal/signup';

  const adminSession = request.cookies.get('session')?.value;
  const memberSession = request.cookies.get('member-session')?.value;

  // Protect Admin
  if (isAdminPath) {
    if (!adminSession) return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    try { await decrypt(adminSession); } catch { return NextResponse.redirect(new URL('/admin/login', request.nextUrl)); }
  }
  if (isAdminLoginPath && adminSession) {
    try { await decrypt(adminSession); return NextResponse.redirect(new URL('/admin', request.nextUrl)); } catch {}
  }

  // Protect Portal
  if (isPortalPath) {
    if (!memberSession) return NextResponse.redirect(new URL('/portal/login', request.nextUrl));
    try { await decrypt(memberSession); } catch { return NextResponse.redirect(new URL('/portal/login', request.nextUrl)); }
  }
  if (isPortalAuthPath && memberSession) {
    try { await decrypt(memberSession); return NextResponse.redirect(new URL('/portal', request.nextUrl)); } catch {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
