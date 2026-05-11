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
    const resource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
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

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        language: body.language,
        link: body.link,
        type: body.type,
        isPublic: body.isPublic
      }
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE_RESOURCE',
        details: `Updated resource: ${resource.title}`,
      }
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
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
    const resource = await prisma.resource.delete({
      where: { id }
    });

    await prisma.log.create({
      data: {
        action: 'DELETE_RESOURCE',
        details: `Deleted resource: ${resource.title}`,
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
