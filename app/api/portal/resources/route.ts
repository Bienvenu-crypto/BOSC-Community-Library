import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireMemberSession } from '@/lib/api-auth';

export async function GET() {
  const authError = await requireMemberSession();
  if (authError) return authError;

  try {
    const resources = await prisma.resource.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        language: true,
        link: true,
        type: true,
        isPublic: true,
        updatedAt: true,
      }
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching portal resources:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
