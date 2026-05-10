import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that require authentication
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isLoginPath = path === '/admin/login';

  const session = request.cookies.get('session')?.value;

  if (isAdminPath) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    }

    try {
      await decrypt(session);
    } catch (error) {
      // Invalid session
      const response = NextResponse.redirect(new URL('/admin/login', request.nextUrl));
      response.cookies.delete('session');
      return response;
    }
  }

  if (isLoginPath && session) {
    try {
      await decrypt(session);
      return NextResponse.redirect(new URL('/admin', request.nextUrl));
    } catch (error) {
      // Session invalid, let them login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
