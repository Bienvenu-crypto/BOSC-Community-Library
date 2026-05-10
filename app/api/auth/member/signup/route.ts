import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Force reload: 2026-05-10-v2
    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { email },
    });

    if (existingMember) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await prisma.member.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: 'active',
        role: 'student', // Default role
      },
    });

    await prisma.log.create({
      data: {
        action: 'MEMBER_SIGNUP',
        details: `New member registered: ${name} (${email})`,
      }
    });

    await login({ id: member.id, email: member.email, name: member.name }, 'member');

    return NextResponse.json({ success: true, name: member.name });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
