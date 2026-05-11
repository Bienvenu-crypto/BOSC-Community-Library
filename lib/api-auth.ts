/**
 * lib/api-auth.ts
 *
 * Centralised authentication guard for admin API routes.
 *
 * Usage (Refactor Issue #5):
 *   const authError = await requireAdminSession();
 *   if (authError) return authError;
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * Returns a 401 NextResponse if no valid admin session exists,
 * otherwise returns null (caller may proceed).
 */
export async function requireAdminSession(): Promise<NextResponse | null> {
  const session = await getSession('admin');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * Returns a 401 NextResponse if no valid member session exists,
 * otherwise returns null.
 */
export async function requireMemberSession(): Promise<NextResponse | null> {
  const session = await getSession('member');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
