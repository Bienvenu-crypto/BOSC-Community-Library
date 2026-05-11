import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdminSession } from '@/lib/api-auth';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

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
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Bug Fix #2: Validate all required fields including password
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'name, email, and password are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.member.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const member = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone,
        role: body.role || 'student',
        status: body.status || 'active',
      }
    });

    // Omit the hashed password from the API response
    const { password: _pw, ...safeMember } = member;

    await prisma.log.create({
      data: {
        action: 'CREATE_MEMBER',
        details: `Admin created member ${member.name} (${member.email})`,
      }
    });

    return NextResponse.json(safeMember, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}
