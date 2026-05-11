import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-auth';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.title || !body.description || !body.category || !body.language || !body.link) {
      return NextResponse.json(
        { error: 'title, description, category, language, and link are required' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        language: body.language,
        link: body.link,
        type: body.type || 'document',
        isPublic: body.isPublic !== undefined ? body.isPublic : true,
      }
    });

    await prisma.log.create({
      data: {
        action: 'CREATE_RESOURCE',
        details: `Created resource: ${resource.title}`,
      }
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
