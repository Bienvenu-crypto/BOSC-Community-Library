import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
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
  try {
    const body = await request.json();
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

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
