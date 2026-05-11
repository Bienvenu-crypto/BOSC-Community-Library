import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-auth';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const logs = await prisma.log.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
