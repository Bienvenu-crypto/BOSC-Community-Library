import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        _count: {
          select: { requests: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const member = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role || 'student',
        status: body.status || 'active',
      }
    });
    
    await prisma.log.create({
      data: {
        action: 'CREATE_MEMBER',
        details: `Created member ${member.name} (${member.email})`,
      }
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}
