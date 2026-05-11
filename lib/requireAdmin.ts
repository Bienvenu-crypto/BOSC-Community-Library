/**
 * requireAdmin – server-side helper that validates the admin session.
 *
 * Usage:
 *   const authError = await requireAdmin();
 *   if (authError) return authError;
 *
 * Returns a 401 NextResponse when the session is absent or invalid,
 * otherwise returns null so the caller can proceed.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getSession('admin');
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: admin session required' },
      { status: 401 }
    );
  }
  return null;
}
