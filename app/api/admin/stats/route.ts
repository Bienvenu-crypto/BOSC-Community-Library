import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [memberCount, resourceCount, requestCount, pendingRequests] = await Promise.all([
      prisma.member.count(),
      prisma.resource.count(),
      prisma.request.count(),
      prisma.request.count({ where: { status: 'pending' } }),
    ]);

    return NextResponse.json({
      members: memberCount,
      resources: resourceCount,
      totalRequests: requestCount,
      pendingRequests: pendingRequests,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
