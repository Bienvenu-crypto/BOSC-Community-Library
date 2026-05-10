import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession('member');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const requests = await prisma.request.findMany({
      where: { memberId: session.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching portal requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession('member');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const newRequest = await prisma.request.create({
      data: {
        memberId: session.id,
        type: body.type,
        details: body.details,
        status: 'pending'
      }
    });

    await prisma.log.create({
      data: {
        action: 'MEMBER_REQUEST_SUBMITTED',
        details: `Member ${session.name} submitted a new ${body.type} request.`,
      }
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error('Error creating portal request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
