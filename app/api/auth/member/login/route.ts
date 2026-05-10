import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (member.status === 'suspended') {
      return NextResponse.json({ error: 'Your account has been suspended' }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, member.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await login({ id: member.id, email: member.email, name: member.name }, 'member');

    return NextResponse.json({ success: true, name: member.name });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
