import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        requests: true
      }
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Omit password from response
    const { password: _pw, ...safeMember } = member;
    return NextResponse.json(safeMember);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    const member = await prisma.member.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        status: body.status
      }
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE_MEMBER',
        details: `Updated member: ${member.name}`,
      }
    });

    const { password: _pw, ...safeMember } = member;
    return NextResponse.json(safeMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const { id } = await params;
    const member = await prisma.member.delete({
      where: { id }
    });

    await prisma.log.create({
      data: {
        action: 'DELETE_MEMBER',
        details: `Deleted member: ${member.name}`,
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
